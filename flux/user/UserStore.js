var Fluxxor = require("fluxxor");
var UserConstants = require("./UserConstants");


var UserStore = Fluxxor.createStore({
  initialize: function() {
    this.users = {};

    this.bindActions(
      UserConstants.LOAD_USER, this.onLoadUser,
      UserConstants.LOAD_USER_SUCCESS, this.onLoadUserSuccess,
      UserConstants.LOAD_USER_FAIL, this.onLoadUserFail
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
  }
});

module.exports = UserStore;
