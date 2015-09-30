var ToastConstants = require("./ToastConstants");


var ToastActions = {
  successToast: function(message) {
    this.dispatch(ToastConstants.SHOW_TOAST, {message: message, type: "success"});
  },
  errorToast: function(message) {
    this.dispatch(ToastConstants.SHOW_TOAST, {message: message, type: "error"});
  }
};

module.exports = ToastActions;
