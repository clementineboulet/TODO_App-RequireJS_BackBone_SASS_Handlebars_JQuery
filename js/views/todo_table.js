/*global define*/
define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	'collections/todos',
	'views/todos',
	'models/todoFilter',
	'helpers/helpers'
], function ($, _, Backbone, Handlebars, Todos, TodoView, TodoFilter,Helpers) {
	'use strict';

	var TodoTableView = Backbone.View.extend({

		el: '#todoapp',

		// Compile the template
		template:  Handlebars.compile($("#script2").html()),

		// Delegated events for creating new items, and clearing completed ones.
		events: {
			'click #clear-completed':	'clearCompleted',
			'click #toggle-all':		'toggleAllComplete',
			'click a': 'updateFilter'
		},

		initialize: function () {	
            this.listenTo(Todos, 'add', this.addOne);
			this.listenTo(Todos, 'reset', this.addAll);
			this.listenTo(Todos, 'change:completed', this.filterOne);
			this.listenTo(Todos, 'filter', this.filterAll);
			this.listenTo(Todos, 'all', this.render);

			//render
            this.render();
			// fetch data
			Todos.fetch();
		},

		renderInit: function () {		
			console.log('table--renderinit');
			var self = this;
			var rendered;
        	if (Todos.length) {

				var complete = Todos.remaining().length == 0 ? 'completed' : '' ; 					
            	rendered = self.template({
            		length:self.collection.toJSON().length ,
            		completed:complete
            	});            	
  				$(document.body).find("#todoapp").append(rendered);

  				//Add each todo render
  				self.addAll();
            }
            else{
            	console.log('nothing');
        	}
			
			return self;
		},
		renderSafe: function () {
			console.log('table--rendersafe');
			var self = this;
			var rendered;
        	if (Todos.length) {
				var complete = Todos.remaining().length == 0 ? 'completed' : '' ;
            	rendered = self.template({
            		length:self.collection.toJSON().length ,
            		completed: complete
            	});
            	
            	var index = rendered.indexOf('<footer');
            	var main = rendered.substring(0,index);
            	var foot = rendered.substring(index);
            	//refresh existing elements
  				$(document.body).find('#main').replaceWith(main);
  				$(document.body).find('#footer').replaceWith(foot);
  				//add each todo render
  				self.addAll();
            }
            else{
            	console.log('nothing');
        	}
			
			return self;
		},

		renderUI: function () {
			var self = this;						
			var completed = Todos.completed().length;
			var remaining = Todos.remaining().length;		
			if (Todos.length) {
				self.$main.show();
				self.$footer.show();	

				var checked = Todos.remaining().length == 0 ? true : false ;
				this.$allCheckbox.prop('checked', checked);

				self.$('#filters li a')
					.removeClass('selected')
					.filter('[href="#/' + (TodoFilter.Filter || '') + '"]')
					.addClass('selected');
			} else {
				self.$main.hide();
				self.$footer.hide();
			}
			return self;
		},

		render: function(){
			console.log('table--render');
			var self = this;
			if($('#main').length != 0){ //add todos table
				self.renderSafe();
			}else{						//refresh todos table
				self.renderInit();
			}
			this.$input = this.$('#new-todo');
			this.$allCheckbox = this.$('#toggle-all');			
			this.$footer = this.$('#footer');
			this.$main = this.$('#main');
			self.renderUI();

			return self;
		},

		// Add a single todo item to the list by creating a view for it, and
		// appending its element to the `<ul>`.
		addOne: function (todo) {
			var view = new TodoView({ model: todo });
			console.log('addOne');


				console.log(view.render().el);
			$('#todo-list').append(view.render().el);
			return view;

		},

		// Add all items in the **Todos** collection at once.
		addAll: function () {
			this.$('#todo-list').html('');
			Todos.each(this.addOne, this);
		},

		filterOne: function (todo) {
			todo.trigger('visible');
		},

		filterAll: function () {
			Todos.each(this.filterOne, this);
		},

		// Generate the attributes for a new Todo item.
		newAttributes: function () {
			return {
				title: this.$input.val().trim(),
				order: Todos.nextOrder(),
				completed: false
			};
		},

		// Clear all completed todo items, destroying their models.
		clearCompleted: function () {
			_.invoke(Todos.completed(), 'destroy');
			return false;
		},

		toggleAllComplete: function () {
			var completed = this.$allCheckbox.prop('checked', 'checked');
			Todos.each(function (todo) {
				todo.save({
					'completed': true
				});
			});
			this.render();
		},

		handleIconClick : function(event) {
		    //process 'event' and create params...
		    this.updateFilter(params);
		},

		updateFilter:function(params){
			var id;
			if(params){			
				id=params.currentTarget.id;
				console.log(id);
			}else{
				id='';
			}
			TodoFilter.Filter = id;
			this.render();
		}		
	});	

	return TodoTableView;
});
