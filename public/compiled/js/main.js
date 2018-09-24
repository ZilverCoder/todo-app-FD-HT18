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
            var ENTER_KEY = 13;
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
            ko.bindingHandlers.enterKey = keyhandlerBindingFactory(ENTER_KEY);
            //#region Functions
            self.taskValue = ko.observable();
            self.taskList = ko.observableArray();
            self.addTask = (function () {
                self.taskList.push(new Task(self.taskValue(), false));
                self.taskValue('');
            }).bind(this);
            //#endregion
        }
        return TodoApp;
    }());
    ko.applyBindings(new TodoApp());
});
