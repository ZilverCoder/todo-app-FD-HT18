define(["require", "exports", "knockout"], function (require, exports, ko) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Task = /** @class */ (function () {
        function Task(value, completed, editMode, previousValue) {
            this.value = ko.observable(value);
            this.completed = ko.observable(completed);
            this.editMode = ko.observable(editMode);
            this.previousValue = previousValue;
        }
        Task.prototype.task = function () {
            return this.value, this.completed, this.editMode, this.previousValue;
        };
        return Task;
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
            ko.bindingHandlers.escapeKey = {
                init: function (element, valueAccessor, allBindingsAccessor, data, bindingContext) {
                    var wrappedHandler = function (data, event) {
                        if (event.keyCode === 27)
                            valueAccessor().call(_this, data, event);
                    };
                    var newValueAccessor = function () {
                        return { keyup: wrappedHandler };
                    };
                    ko.bindingHandlers.event.init(element, newValueAccessor, allBindingsAccessor, data, bindingContext);
                }
            };
            //#region Functions
            self.taskValue = ko.observable();
            self.taskList = ko.observableArray();
            self.addTask = (function () {
                if (self.taskValue().length > 0)
                    self.taskList.push(new Task(self.taskValue(), false, false, ""));
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
                return self.remainingTasksCount() == 1 ? self.remainingTasksCount() + "\titem left" : self.remainingTasksCount() + " items left";
            }, this);
            self.completedTasks = ko.computed(function () {
                return self.taskList().length - _this.remainingTasksCount() > 0;
            }, this);
            self.editModeOn = (function (task) {
                task.editMode(true);
                task.previousValue = task.value();
            }).bind(this);
            self.cancelEdit = (function (task) {
                task.editMode(false);
                task.value(task.previousValue);
            }).bind(this);
            self.saveEdit = (function (task) {
                task.editMode(false);
            }).bind(this);
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
