/*global define*/
define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	'collections/todos',
	'views/todos',
	'models/todoFilter',
	'views/todo_table',
], function ($, _, Backbone, Handlebars, Todos, TodoView, TodoFilter, TodoTableView) {
	'use strict';

	var AppView = Backbone.View.extend({

		el: '#body',

		template:  Handlebars.compile($("#script").html()),

		// Delegated events for creating new items.
		events: {
			'keypress #new-todo':		'createOnEnter'
		},

		initialize: function () {			

            var self = this;
            self.render();
            
			Todos.fetch();
			this.$todotable = new TodoTableView({collection:Todos});

			this.$input = this.$('#new-todo');
			
			return self;

		},

		// Re-rendering the App just means refreshing the statistics -- the rest
		// of the app doesn't change.
		render: function () {
			var completed = Todos.completed().length;
			var remaining = Todos.remaining().length;

			var self = this;
			var rendered;
        	rendered = self.template();
        	
			console.log('app--renderinit');
        	$("#body").html(rendered);
        	$(document.body).find('#body').append(this.$el);
           
			return self;
		},

		// Generate the attributes for a new Todo item.
		newAttributes: function () {
			console.log('app--newattribute');
			return {
				title: this.$input.val().trim(),
				order: Todos.nextOrder(),
				completed: false
			};
		},

		createOnEnter: function (e) {
			var self = this;
			if (e.which !== TodoFilter.ENTER_KEY || !self.$input.val().trim()) {
				return;
			}
			Todos.create(self.newAttributes());
			self.$input.val('');
			return self;
		}	
	});	

	return AppView;
});
