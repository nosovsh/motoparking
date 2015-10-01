var CurrentUserConstants = require("./CurrentUserConstants");
var CurrentUserClient = require("./CurrentUserClient");

var CurrentUserActions = {
  loadCurrentUser: function() {
    this.dispatch(CurrentUserConstants.LOAD_CURRENT_USER, {});

    CurrentUserClient.loadCurrentUser(function(currentUser) {
      this.manualUpdateCurrentUser(currentUser);
    }.bind(this), function(error) {
      this.dispatch(CurrentUserConstants.LOAD_CURRENT_USER_FAIL, {error: error});
    }.bind(this));
  },

  /**
   * Update current user without request to server
   * @param currentUser
   */
  manualUpdateCurrentUser: function(currentUser) {
    this.dispatch(CurrentUserConstants.LOAD_CURRENT_USER_SUCCESS, {currentUser: currentUser});
  },

  authorizationRequired: function() {
    this.dispatch(CurrentUserConstants.AUTHORIZATION_REQUIRED, {});
  }
};

module.exports = CurrentUserActions;
