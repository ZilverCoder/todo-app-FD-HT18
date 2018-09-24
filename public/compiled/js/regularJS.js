/*
var taskValue = ko.observable();
var taskIdentifier = ko.observable();
var taskCompleted = ko.observable();
var taskList = ko.observableArray();
*/

var TodoApp = function(){
	var self = this;
	var task = function(taskValue, taskCompleted){
		this.value = ko.observable(taskValue);
		this.completed = ko.observable(taskCompleted);
	}
	//#region Custom Ko Bindings
		var ENTER_KEY = 13;
		var ESCAPE_KEY = 27;
		function keyhandlerBindingFactory(keyCode) {
			return {
				init: function (element, valueAccessor, allBindingsAccessor, data, bindingContext) {
					var wrappedHandler, newValueAccessor;

					// wrap the handler with a check for the enter key
					wrappedHandler = function (data, event) {
						if (event.keyCode === keyCode) {
							valueAccessor().call(this, data, event);
						}
					};

					// create a valueAccessor with the options that we would want to pass to the event binding
					newValueAccessor = function () {
						return {
							keyup: wrappedHandler
						};
					};

					// call the real event binding's init function
					ko.bindingHandlers.event.init(element, newValueAccessor, allBindingsAccessor, data, bindingContext);
				}
			};
		}
		ko.bindingHandlers.enterKey = keyhandlerBindingFactory(ENTER_KEY);
	//#endregion
	
	//#region Functions
		self.taskValue = ko.observable();
		self.taskList = ko.observableArray();
		self.addTask = function(){
			self.taskList.push(new task(self.taskValue(), false));
			self.taskValue('');
		}.bind(this);
		self.removeTask = function(task) {
			self.taskList.remove(task);
		}.bind(this);
		this.clearCompletedTasks = function() {
			this.taskList.remove((task) => {
				return task.completed();
		  });
		}.bind(this);
		self.remainingTasks = ko.computed(function(){
			return self.taskList().filter(function (task) {
				return !task.completed();
			}).length + " items left";
		}, this);
	//#endregion
	
	//#region Filters
		self.filterMode = ko.observable('all')
		self.filteredTaskList = ko.computed(function(){
			switch(this.filterMode()){
				case 'todo':
					return self.taskList().filter(function(task){
						return !task.completed();
					});
				case 'done':
					return self.taskList().filter(function(task){
						return task.completed();
					});
				default:
					return self.taskList();
			}
		}, this);
		self.changeToAll = function(){
			self.filterMode('all');
		}
		self.changeToActive = function(){
			self.filterMode('todo');
		}
		self.changeToCompleted = function() {
			self.filterMode('done');
		}
	//#endregion	
}

ko.applyBindings(new TodoApp());