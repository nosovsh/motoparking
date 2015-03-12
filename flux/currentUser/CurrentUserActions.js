var CurrentUserConstants = require("./CurrentUserConstants"),
    CurrentUserClient = require("./CurrentUserClient");

var CurrentUserActions = {
    loadCurrentUser: function () {
        this.dispatch(CurrentUserConstants.LOAD_CURRENT_USER, {});

        CurrentUserClient.loadCurrentUser(function (currentUser) {
            this.dispatch(CurrentUserConstants.LOAD_CURRENT_USER_SUCCESS, {currentUser: currentUser})
        }.bind(this), function (error) {
            this.dispatch(CurrentUserConstants.LOAD_CURRENT_USER_FAIL, {error: error});
        })
    },
    manualUpdateCurrentUser: function (currentUser) {
        this.dispatch(CurrentUserConstants.LOAD_CURRENT_USER_SUCCESS, {currentUser: currentUser})
    }
};

module.exports = CurrentUserActions;