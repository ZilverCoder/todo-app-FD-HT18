import * as ko from "knockout";

class Task {
	value: KnockoutObservable<string>
	completed: KnockoutObservable<boolean>
	constructor(value: string, completed: boolean){
		this.value = ko.observable(value);
		this.completed = ko.observable(completed);
	}
	task() {
		return this.value, this.completed;
	}
}

class TodoApp {
	taskValue: KnockoutObservable<string>
	taskCompleted: KnockoutObservable<boolean>
	taskList: KnockoutObservableArray<object>
	//Functions
	addTask: KnockoutComputed<string>

    constructor() {
		let self = this;
		let ENTER_KEY = 13;
		function keyhandlerBindingFactory(keyCode: number) {
			return {
				init: function (element: any, valueAccessor: any, allBindingsAccessor: any, data: any, bindingContext: any) {
					let wrappedHandler: any;
					let newValueAccessor: any;
					// wrap the handler with a check for the enter key
					wrappedHandler = function (data: any, event: any) {
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
		//#region Functions
			self.taskValue = ko.observable();
			self.taskList = ko.observableArray();
			self.addTask = (() => {
				self.taskList.push(new Task(self.taskValue(), false));
				self.taskValue('');
			}).bind(this);

		//#endregion
    }
}

ko.applyBindings(new TodoApp());