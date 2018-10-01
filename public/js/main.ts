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
	taskList: KnockoutObservableArray<object>
	//Functions
	addTask: KnockoutComputed<string>
	toggleAllCompleted: KnockoutComputed<boolean>
	removeTask: KnockoutComputed<boolean>
	remainingTasksCount: KnockoutComputed<number>
	remainingTasks: KnockoutComputed<string>
	completedTasks: KnockoutComputed<boolean>
	clearCompletedTasks: KnockoutComputed<boolean>
	//Filters
	filterMode: KnockoutObservable<string>
	filteredTaskList: KnockoutComputed<object>
	changeToAll: () => void
	changeToActive: () => void
	changeToCompleted: () => void

    constructor() {
		let self = this;
		const enter_key:number = 13;
		function keyhandlerBindingFactory(keyCode: number) {
			return {
				init: function (element: HTMLElement, valueAccessor: any, allBindingsAccessor: any, data: any, bindingContext: any) {
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
		ko.bindingHandlers.enterKey = keyhandlerBindingFactory(enter_key);
		//#region Functions
			self.taskValue = ko.observable();
			self.taskList = ko.observableArray();
			self.addTask = (() => {
				if(self.taskValue().length > 0)
					self.taskList.push(new Task(self.taskValue(), false));
				self.taskValue('');
			}).bind(this);
			self.toggleAllCompleted = (() => {
				let toogleCompleted:boolean = false;

				if(self.remainingTasksCount() > 0){
					toogleCompleted = true;
				}

				ko.utils.arrayForEach(self.taskList(), (task:Task) => {
					task.completed(toogleCompleted);
				});
			}).bind(this);
			self.removeTask = ((task: Task) => {
				self.taskList.remove(task);
			}).bind(this);
			self.clearCompletedTasks = (() => {
				self.taskList.remove((task: Task) => {
					return task.completed();
				});
			}).bind(this);
			self.remainingTasksCount = ko.computed(() => {
				return self.taskList().filter(function (task: Task) {
					return !task.completed();
				}).length;
			});
			self.remainingTasks = ko.computed(() => {
				return self.remainingTasksCount() + " items left";
			}, this);
			self.completedTasks = ko.computed(() => {
				return self.taskList().length - this.remainingTasksCount() > 0;
			}, this);
		//#endregion
		//#region Filter Functions
			self.filterMode = ko.observable('all');
			self.filteredTaskList = ko.computed(() => {
				switch(self.filterMode()){
					case 'todo':
						return self.taskList().filter((task: Task) => {
							return !task.completed();
						});
					case 'done':
						return self.taskList().filter((task: Task) => {
							return task.completed();
						});
					default:
						return self.taskList();
				}
			}, this);
			self.changeToAll = () => {
				self.filterMode('all');
			}
			self.changeToActive = () => {
				self.filterMode('todo');
			}
			self.changeToCompleted = () => {
				self.filterMode('done');
			}
		//#endregion
	}
}

ko.applyBindings(new TodoApp());