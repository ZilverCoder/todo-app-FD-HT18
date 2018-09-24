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
	//#endregion
	
	//#region Filters
	//#endregion	
}

ko.applyBindings(new TodoApp());