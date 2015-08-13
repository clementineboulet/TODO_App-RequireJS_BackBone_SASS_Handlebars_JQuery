/*global define*/
define([
	'jquery',
	'backbone',
	'collections/todos',
	'models/todoFilter'
], function ($, Backbone, Todos, TodoFilter) {
	'use strict';

	var Workspace = Backbone.Router.extend({
		routes: {
			'*filter': 'setFilter'
		},

		setFilter: function (param) {
			// Set the current filter to be used
			TodoFilter.Filter = param.trim() || '';

			// Trigger a collection filter event, causing hiding/unhiding
			// of the Todo view items
			Todos.trigger('filter');
		}
	});

	return Workspace;
});
