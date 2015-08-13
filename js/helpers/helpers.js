define([
	'handlebars',
	'collections/todos'
], function (Handlebars, Todos) {
	var helper = Handlebars.registerHelper({
		'remaining': function(){

		var completed = Todos.completed().length;
		var remaining = Todos.length - completed;
		var strong = '<strong>'+remaining+'</strong> ';
		var item = remaining == 1 ? 'item' : 'items' ;
		var left = ' left';
		var help = new Handlebars.SafeString(strong+item+left)

		return help;
		}
	});     
	
	return helper;
});