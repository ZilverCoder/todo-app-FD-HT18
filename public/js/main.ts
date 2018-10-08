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

class Lang {
	items_left: KnockoutObservable<string>
	filter_all: KnockoutObservable<string>
	filter_active: KnockoutObservable<string>
	filter_completed: KnockoutObservable<string>
	clearCompleted: KnockoutObservable<string>
	whatNeedsDone: KnockoutObservable<string>
	todos: KnockoutObservable<string>

	constructor(items_left: string, filter_all: string, filter_active: string, 
				filter_completed: string, clearCompleted: string, whatNeedsDone: string, todos: string){
		this.items_left = ko.observable(items_left);
		this.filter_all = ko.observable(filter_all);
		this.filter_active = ko.observable(filter_active);
		this.filter_completed = ko.observable(filter_completed);
		this.clearCompleted = ko.observable(clearCompleted);
		this.whatNeedsDone = ko.observable(whatNeedsDone);
		this.todos = ko.observable(todos);
	}
	lang() {
		return this.items_left, this.filter_all, this.filter_active, 
				this.filter_completed, this.clearCompleted, this.whatNeedsDone, this.todos;
	}
}

class TodoApp {
	taskValue: KnockoutObservable<string>
	taskList: KnockoutObservableArray<Task>
	//Languages
	currentLangOption: KnockoutObservable<string>
	currentLang: KnockoutComputed<Lang>
	changeLangToEng: () => void
	changeLangToKor: () => void
	changeLangToJap: () => void
	changeLangToPol: () => void
	changeLangToSwe: () => void
	engLang: Lang
	koreanLang: Lang
	langBoxVisible: KnockoutObservable<boolean>
	toggleLangBox: () => void
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
		//#region Language Switcher
			self.langBoxVisible = ko.observable(false);
			self.currentLangOption = ko.observable('eng');
			self.currentLang = ko.computed(() => {
				switch(self.currentLangOption()){
					case 'eng':
						return new Lang("items left", "all", "active", "completed", "Clear completed", "what be needing doneing", "todos");
					case 'kor':
						return new Lang("남은 항목", "모든", "유효한", "완료된", "명확한 완료","해야 할 일", "할것");
					case 'jap':
						return new Lang("左のアイテム", "すべて", "アクティブ", "完了", "クリア済み", "実行する必要があるもの", "リスト");
					case 'pol':
						return new Lang("rzeczy w lewo", "wszystko", "obecny", "zakończony", "Czyszczenie zakończone", "Co musi być zrobione", "do zrobienia");
					case 'swe':
						return new Lang("kvar att göra", "allt", "aktiva", "klara", "Töm klara", "vad ska göras", "att göra");
					default:
						return new Lang("items left", "all", "active", "completed", "Clear completed","what be needing doneing", "todos");
				}
			}, this);
			self.changeLangToEng = () => {
				self.currentLangOption('eng');
			};
			self.changeLangToKor = () => {
				self.currentLangOption('kor');
			};
			self.changeLangToJap = () => {
				self.currentLangOption('jap');
			};
			self.changeLangToPol = () => {
				self.currentLangOption('pol');
			};
			self.changeLangToSwe = () => {
				self.currentLangOption('swe');
			};
			self.toggleLangBox = (() => {
				return self.langBoxVisible() == true ? self.langBoxVisible(false) : self.langBoxVisible(true);
			}).bind(this);
		//#endregion
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
				return self.remainingTasksCount() + " " + ko.unwrap(self.currentLang().items_left);
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