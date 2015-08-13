define(
'models/todo',
['underscore','backbone'],
function (_,Backbone) {
	'use strict';
	var TodoModel = Backbone.Model.extend({
		defaults: {
			title: '',
			completed: false,
			editing:false
		},

		toggle: function () {
			this.save({
				completed: !this.get('completed')
			});
		},

		editing: function () {
			this.save({
				editing: !this.get('editing')
			});
		},

		clear: function () {
			this.destroy();
		}
	});
	return TodoModel
});