var _ = require("lodash");
var Fluxxor = require("fluxxor");
var UserConstants = require("./UserConstants");


var UserStore = Fluxxor.createStore({
  initialize: function() {
    this.users = {};
    this.usersIds = []; // list of user ids ordered by creation date

    this.bindActions(
      UserConstants.LOAD_USER, this.onLoadUser,
      UserConstants.LOAD_USER_SUCCESS, this.onLoadUserSuccess,
      UserConstants.LOAD_USER_FAIL, this.onLoadUserFail,

      UserConstants.LOAD_USERS, this.onLoadUsers,
      UserConstants.LOAD_USERS_SUCCESS, this.onLoadUsersSuccess,
      UserConstants.LOAD_USERS_FAIL, this.onLoadUsersFail
    );
  },

  onLoadUser: function(payload) { // eslint-disable-line no-unused-vars
  },

  onLoadUserSuccess: function(payload) {
    this.users[payload.user.id] = _.extend({}, this.users[payload.user.id] || {}, payload.user, {fullUserLoaded: true});
    // saving just ids of opinions. Opinion objects will be saved in OpinionStore
    this.users[payload.user.id].opinionIds = _.pluck(this.users[payload.user.id].opinions, "id");
    delete this.users[payload.user.id].opinions;
    this.emit("change");
  },

  onLoadUserFail: function(payload) { // eslint-disable-line no-unused-vars
  },

  onLoadUsers: function(payload) { // eslint-disable-line no-unused-vars
  },

  onLoadUsersSuccess: function(payload) {
    this.usersIds = [];
    payload.users.map(function(user) {
      // those fields are null in that server response.
      // I don't want them to override existing values
      delete user.opinions;
      delete user.socialConnections;
      delete user.stats;

      this.users[user.id] = _.extend({}, this.users[user.id] || {}, user);
      this.usersIds.push(user.id);
    }.bind(this));
    this.emit("change");
  },

  onLoadUsersFail: function(payload) { // eslint-disable-line no-unused-vars
  }
});

module.exports = UserStore;
