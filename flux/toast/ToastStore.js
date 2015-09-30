var Fluxxor = require("fluxxor");
var ToastConstants = require("./ToastConstants");

var TOAST_TIMEOUT = 50000000;

var ToastStore = Fluxxor.createStore({
  initialize: function() {
    this.toasts = [];
    this.bindActions(
      ToastConstants.SHOW_TOAST, this.onShowToast
    );
  },

  onShowToast: function(toast) {
    toast.id = toast.id || Math.random();
    this.toasts.unshift(toast);
    setTimeout(this.onRemoveToast.bind(this, toast.id), TOAST_TIMEOUT);
    this.emit("change");
  },

  onRemoveToast: function(id) {
    this.toasts = this.toasts.filter(function(toast) {
      return toast.id !== id;
    });
    this.emit("change");
  }
});

module.exports = ToastStore;
