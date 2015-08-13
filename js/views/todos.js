/*global define*/
define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	'models/todoFilter',
	'models/todo',
	'helpers/helpers'
], function ($, _, Backbone, Handlebars, TodoFilter, TodoModel, Helpers) {
	'use strict';

	var TodoView = Backbone.View.extend({

		tagName: 'li',
		model: new TodoModel(),

		template: Handlebars.compile($("#script3").html()),

		// The DOM events specific to an item.
		events: {
			'click .toggle':	'toggleCompleted',
			'dblclick label':	'edit',
			'click .destroy':	'clear',
			'keypress .edit':	'updateOnEnter',
			'blur .edit':		'try'
		},

		initialize: function () {
			console.log('todo--init');
			//this.render();
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
			this.listenTo(this.model, 'visible', this.toggleVisible);
		},

		// Re-render the titles of the todo item.
		render: function () {
			var self = this;
			var rendered = self.template(self.model.toJSON());
			self.$el.html(rendered);			
			self.$el.toggleClass('completed', this.model.get('completed'));

			self.toggleVisible();
			if(self.model.get('editing')){
				self.$el.find('input').addClass('edit');
			}
			this.$input = this.$('.edit');
			this.$input.focus();
			return self;
		},

		toggleVisible: function () {
			this.$el.toggleClass('hidden',  this.isHidden());
		},

		isHidden: function () {
			var isCompleted = this.model.get('completed');
			return (// hidden cases only
				(!isCompleted && TodoFilter.Filter === 'completed') ||
				(isCompleted && TodoFilter.Filter === 'active')
			);
		},

		// Toggle the `"completed"` state of the model.
		toggleCompleted: function () {
			this.model.toggle();
		},

		// Switch this view into `"editing"` mode, displaying the input field.
		edit: function () {
			console.log('todo--edit');
			this.model.editing();
			this.$el.find('input').addClass('edit');			
		},

		// Close the `"editing"` mode, saving changes to the todo.
		close: function () {
			console.log('todo--close');
			var value = this.$input.val().trim();

			if (value) {
				this.model.save({ title: value });
			} else {
				this.clear();
			}
			this.$el.find('input').removeClass('edit');
			this.model.editing();
		},

		// If you hit `enter`, we're through editing the item.
		updateOnEnter: function (e) {
			console.log('todo--updateonenter');
			if (e.keyCode === TodoFilter.ENTER_KEY) {
				this.close();
			}
		},

		// Remove the item, destroy the model from *localStorage* and delete its view.
		clear: function () {
			console.log('todo--clear');
			this.model.clear();
		},

		try:function(){
			console.log('blur');
			this.close();
		}
	});

	return TodoView;
});
