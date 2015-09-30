var Fluxxor = require("fluxxor");
var CurrentUserConstants = require("./CurrentUserConstants");


var CurrentUserStore = Fluxxor.createStore({
  initialize: function() {
    this.loading = false;
    this.error = null;
    this.currentUser = {};

    this.bindActions(
      CurrentUserConstants.LOAD_CURRENT_USER, this.onLoadCurrentUser,
      CurrentUserConstants.LOAD_CURRENT_USER_SUCCESS, this.onLoadCurrentUserSuccess,
      CurrentUserConstants.LOAD_CURRENT_USER_FAIL, this.onLoadCurrentUserFail,

      CurrentUserConstants.AUTHORIZATION_REQUIRED, this.onAuthorizationRequired
    );
  },

  onLoadCurrentUser: function(payload) { // eslint-disable-line no-unused-vars
    this.loading = true;
    this.emit("change");
  },

  onLoadCurrentUserSuccess: function(payload) {
    this.currentUser = payload.currentUser;
    this.loading = false;
    this.error = null;
    this.emit("change");
  },

  onLoadCurrentUserFail: function(payload) {
    this.loading = false;
    this.error = payload.error;
    this.emit("change");
  },

  onAuthorizationRequired: function(payload) { // eslint-disable-line no-unused-vars
    window.location = "/login?next=" + window.location.pathname;
  },

  isAuthorized: function() {
    return !!this.currentUser.id;
  }
});

module.exports = CurrentUserStore;
