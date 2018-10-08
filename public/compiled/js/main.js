define(["require", "exports", "knockout"], function (require, exports, ko) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Task = /** @class */ (function () {
        function Task(value, completed) {
            this.value = ko.observable(value);
            this.completed = ko.observable(completed);
        }
        Task.prototype.task = function () {
            return this.value, this.completed;
        };
        return Task;
    }());
    var Lang = /** @class */ (function () {
        function Lang(items_left, filter_all, filter_active, filter_completed, clearCompleted, whatNeedsDone, todos) {
            this.items_left = ko.observable(items_left);
            this.filter_all = ko.observable(filter_all);
            this.filter_active = ko.observable(filter_active);
            this.filter_completed = ko.observable(filter_completed);
            this.clearCompleted = ko.observable(clearCompleted);
            this.whatNeedsDone = ko.observable(whatNeedsDone);
            this.todos = ko.observable(todos);
        }
        Lang.prototype.lang = function () {
            return this.items_left, this.filter_all, this.filter_active,
                this.filter_completed, this.clearCompleted, this.whatNeedsDone, this.todos;
        };
        return Lang;
    }());
    var TodoApp = /** @class */ (function () {
        function TodoApp() {
            var _this = this;
            var self = this;
            var enter_key = 13;
            function keyhandlerBindingFactory(keyCode) {
                return {
                    init: function (element, valueAccessor, allBindingsAccessor, data, bindingContext) {
                        var wrappedHandler;
                        var newValueAccessor;
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
            ko.bindingHandlers.enterKey = keyhandlerBindingFactory(enter_key);
            //#region Language Switcher
            self.langBoxVisible = ko.observable(false);
            self.currentLangOption = ko.observable('eng');
            self.currentLang = ko.computed(function () {
                switch (self.currentLangOption()) {
                    case 'eng':
                        return new Lang("items left", "all", "active", "completed", "Clear completed", "what be needing doneing", "todos");
                    case 'kor':
                        return new Lang("남은 항목", "모든", "유효한", "완료된", "명확한 완료", "해야 할 일", "할것");
                    case 'jap':
                        return new Lang("左のアイテム", "すべて", "アクティブ", "完了", "クリア済み", "実行する必要があるもの", "リスト");
                    case 'pol':
                        return new Lang("rzeczy w lewo", "wszystko", "obecny", "zakończony", "Czyszczenie zakończone", "Co musi być zrobione", "do zrobienia");
                    default:
                        return new Lang("items left", "all", "active", "completed", "Clear completed", "what be needing doneing", "todos");
                }
            }, this);
            self.changeLangToEng = function () {
                self.currentLangOption('eng');
            };
            self.changeLangToKor = function () {
                self.currentLangOption('kor');
            };
            self.changeLangToJap = function () {
                self.currentLangOption('jap');
            };
            self.changeLangToPol = function () {
                self.currentLangOption('pol');
            };
            self.toggleLangBox = (function () {
                return self.langBoxVisible() == true ? self.langBoxVisible(false) : self.langBoxVisible(true);
            }).bind(this);
            //#endregion
            //#region Functions
            self.taskValue = ko.observable();
            self.taskList = ko.observableArray();
            self.addTask = (function () {
                if (self.taskValue().length > 0)
                    self.taskList.push(new Task(self.taskValue(), false));
                self.taskValue('');
            }).bind(this);
            self.toggleAllCompleted = (function () {
                var toogleCompleted = false;
                if (self.remainingTasksCount() > 0) {
                    toogleCompleted = true;
                }
                ko.utils.arrayForEach(self.taskList(), function (task) {
                    task.completed(toogleCompleted);
                });
            }).bind(this);
            self.removeTask = (function (task) {
                self.taskList.remove(task);
            }).bind(this);
            self.clearCompletedTasks = (function () {
                self.taskList.remove(function (task) {
                    return task.completed();
                });
            }).bind(this);
            self.remainingTasksCount = ko.computed(function () {
                return self.taskList().filter(function (task) {
                    return !task.completed();
                }).length;
            });
            self.remainingTasks = ko.computed(function () {
                return self.remainingTasksCount() + " " + ko.unwrap(self.currentLang().items_left);
            }, this);
            self.completedTasks = ko.computed(function () {
                return self.taskList().length - _this.remainingTasksCount() > 0;
            }, this);
            //#endregion
            //#region Filter Functions
            self.filterMode = ko.observable('all');
            self.filteredTaskList = ko.computed(function () {
                switch (self.filterMode()) {
                    case 'todo':
                        return self.taskList().filter(function (task) {
                            return !task.completed();
                        });
                    case 'done':
                        return self.taskList().filter(function (task) {
                            return task.completed();
                        });
                    default:
                        return self.taskList();
                }
            }, this);
            self.changeToAll = function () {
                self.filterMode('all');
            };
            self.changeToActive = function () {
                self.filterMode('todo');
            };
            self.changeToCompleted = function () {
                self.filterMode('done');
            };
            //#endregion
        }
        return TodoApp;
    }());
    ko.applyBindings(new TodoApp());
});
