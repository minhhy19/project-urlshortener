const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose);

const Schema = mongoose.Schema(
	{
		original_url: String
	},
	{
		collection: 'URL',
		versionKey: false,
		timestamps: true
	}
);

Schema.index({ original_url: 1 });

/*
| ==========================================================
| Plugins
| ==========================================================
*/

Schema.plugin(autoIncrement.plugin, {
	model: `${Schema.options.collection}-id`,
	field: 'short_url',
	startAt: 1,
	incrementBy: 1
});

module.exports = mongoose.model(Schema.options.collection, Schema);
