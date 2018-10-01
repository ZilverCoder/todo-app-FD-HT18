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
    var TodoApp = /** @class */ (function () {
        function TodoApp() {
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
            //#region Functions
            self.taskValue = ko.observable();
            self.taskList = ko.observableArray();
            self.addTask = (function () {
                if (self.taskValue().length > 0)
                    self.taskList.push(new Task(self.taskValue(), false));
                self.taskValue('');
            }).bind(this);
            self.toggleAllCompleted = (function() {
				var toogleCompleted = false;
				if(self.remainingTasksCount() > 0){
					toogleCompleted = true;
				}
				ko.utils.arrayForEach(self.taskList(), function(task) {
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
            self.remainingTasksCount = ko.computed(function() {
                return self.taskList().filter(function (task) {
                    return !task.completed();
                }).length;
            }, this);
            self.remainingTasks = ko.computed(function () {
                return self.remainingTasksCount()  + " items left";
            }, this);
            self.completedTasks = ko.computed(function () {
                return self.taskList().length - self.remainingTasksCount() > 0;
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