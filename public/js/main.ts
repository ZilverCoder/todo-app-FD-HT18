import * as ko from "knockout";

class Task {
	value: KnockoutObservable<string>
	completed: KnockoutObservable<boolean>
	editMode: KnockoutObservable<boolean>
	previousValue: string
	constructor(value: string, completed: boolean, editMode: boolean, previousValue: string){
		this.value = ko.observable(value);
		this.completed = ko.observable(completed);
		this.editMode = ko.observable(editMode);
		this.previousValue = previousValue;
	}
	task() {
		return this.value, this.completed, this.editMode, this.previousValue;
	}
}

class TodoApp {
	taskValue: KnockoutObservable<string>
	taskList: KnockoutObservableArray<Task>
	//Functions
	addTask: KnockoutComputed<string>
	toggleAllCompleted: KnockoutComputed<boolean>
	removeTask: KnockoutComputed<boolean>
	remainingTasksCount: KnockoutComputed<number>
	remainingTasks: KnockoutComputed<string>
	completedTasks: KnockoutComputed<boolean>
	clearCompletedTasks: KnockoutComputed<boolean>

	editModeOn: KnockoutComputed<boolean>
	saveEdit: KnockoutComputed<boolean>
	cancelEdit: () => void
	//Filters
	filterMode: KnockoutObservable<string>
	filteredTaskList: KnockoutComputed<object>
	changeFilterMode: (mode: string) => void

    constructor() {
		let self = this;
		//Custom ko binding
			ko.bindingHandlers.enterKey = {
				init: (element: HTMLElement, valueAccessor: any, allBindingsAccessor: any, data: any, bindingContext: any) => {
					let wrappedHandler = (data: any, event: any) => {
						if(event.keyCode === 13) 
							valueAccessor().call(this, data, event);
					}
					let newValueAccessor = () => {
						return {keyup: wrappedHandler }
					}
					ko.bindingHandlers.event.init(element, newValueAccessor, allBindingsAccessor, data, bindingContext);
				}
			};
			ko.bindingHandlers.escapeKey = {
				init: (element: HTMLElement, valueAccessor: any, allBindingsAccessor: any, data: any, bindingContext: any) => {
					let wrappedHandler = (data: any, event: any) => {
						if(event.keyCode === 27) 
							valueAccessor().call(this, data, event);
					}
					let newValueAccessor = () => {
						return {keyup: wrappedHandler }
					}
					ko.bindingHandlers.event.init(element, newValueAccessor, allBindingsAccessor, data, bindingContext);
				}
			};
		//#region Functions
			self.taskValue = ko.observable();
			self.taskList = ko.observableArray();
			self.addTask = (() => {
				if(self.taskValue().length > 0)
					self.taskList.push(new Task(self.taskValue(), false, false, ""));
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
				return self.remainingTasksCount() == 1 ? self.remainingTasksCount() + "\titem left" : self.remainingTasksCount() + " items left";
			}, this);
			self.completedTasks = ko.computed(() => {
				return self.taskList().length - this.remainingTasksCount() > 0;
			}, this);

			self.editModeOn = ((task: Task) => {
				task.editMode(true);
				task.previousValue = task.value();
            }).bind(this);
            self.cancelEdit = ((task: Task) => {
				task.editMode(false);
				task.value(task.previousValue);
            }).bind(this);
            self.saveEdit = ((task: Task) => {
				task.editMode(false);
            }).bind(this);
		//#endregion
		//#region Filter Functions
			self.filterMode = ko.observable('all');
			self.filteredTaskList = ko.computed(() => {
				switch(self.filterMode()){
					case 'active':
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
			self.changeFilterMode = (mode) => {
				self.filterMode(mode);
			}
		//#endregion
	}
}

ko.applyBindings(new TodoApp());