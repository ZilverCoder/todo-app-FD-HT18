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
            //Custom ko binding
            ko.bindingHandlers.enterKey = {
                init: function (element, valueAccessor, allBindingsAccessor, data, bindingContext) {
                    var wrappedHandler = function (data, event) {
                        if (event.keyCode === 13)
                            valueAccessor().call(_this, data, event);
                    };
                    var newValueAccessor = function () {
                        return { keyup: wrappedHandler };
                    };
                    ko.bindingHandlers.event.init(element, newValueAccessor, allBindingsAccessor, data, bindingContext);
                }
            };
            //#region Language Switcher
            self.langBoxVisible = ko.observable(false);
            self.currentLangOption = ko.observable('eng'); //Which language is standard
            self.currentLang = ko.computed(function () {
                switch (self.currentLangOption()) {
                    case 'eng':
                        return new Lang("items left", "all", "active", "completed", "Clear completed", "what be needing doneing", "todos");
                    case 'ko':
                        return new Lang("남은 항목", "모든", "유효한", "완료된", "명확한 완료", "해야 할 일", "할것");
                    case 'jap':
                        return new Lang("左のアイテム", "すべて", "アクティブ", "完了", "クリア済み", "実行する必要があるもの", "リスト");
                    case 'pol':
                        return new Lang("Rzeczy w lewo", "Wszystko", "Obecny", "Zakończony", "Czyszczenie zakończone", "Co musi być zrobione", "Do zrobienia");
                    case 'swe':
                        return new Lang("kvar att göra", "allt", "aktiva", "klara", "Töm klara", "vad ska göras", "att göra");
                    default:
                        return new Lang("items left", "all", "active", "completed", "Clear completed", "what be needing doneing", "todos");
                }
            }, this);
            self.changeLang = function (lang) {
                self.currentLangOption(lang);
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
                    case 'active':
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
            self.changeFilterMode = function (mode) {
                self.filterMode(mode);
            };
            //#endregion
        }
        return TodoApp;
    }());
    ko.applyBindings(new TodoApp());
});
