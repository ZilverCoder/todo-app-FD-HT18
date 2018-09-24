import * as ko from "knockout";

/* class Task{
	taskValue: KnockoutObservable<string>
	taskIdentifier: KnockoutObservable<string>
	taskCompleted: KnockoutObservable<boolean>
	taskList: KnockoutObservableArray<object>
	constructor(taskValue: string, taskIdentifier: string, taskCompleted: boolean) {
		this.taskValue = ko.observable();
		this.taskIdentifier = ko.observable();
		this.taskCompleted = ko.observable(false);
	}
	makeNew
} */

class TodoApp {
	taskValue: KnockoutObservable<string>
	taskIdentifier: KnockoutObservable<string>
	taskCompleted: KnockoutObservable<boolean>
	taskList: KnockoutObservableArray<string[]>
	//Functions
	addTask: KnockoutComputed<string>

    constructor() {
		var task = function(taskValue, completed){
			this.taskValue = ko.observable(taskValue);
			this.taskCompleted = ko.observable(completed);
		};
		this.taskList = ko.observableArray();
		this.taskValue = ko.observable();
		this.addTask = ko.computed(function(){
			return this.taskList().push(this.taskValue());
		}, this);
    }
}

ko.applyBindings(new TodoApp());