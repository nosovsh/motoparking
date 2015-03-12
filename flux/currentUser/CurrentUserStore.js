var Fluxxor = require("fluxxor"),
    CurrentUserConstants = require("./CurrentUserConstants"),
    _ = require("lodash");

var CurrentUserStore = Fluxxor.createStore({
    initialize: function () {
        this.loading = false;
        this.error = null;
        this.currentUser = {};

        this.bindActions(
            CurrentUserConstants.LOAD_CURRENT_USER, this.onLoadCurrentUser,
            CurrentUserConstants.LOAD_CURRENT_USER_SUCCESS, this.onLoadCurrentUserSuccess,
            CurrentUserConstants.LOAD_CURRENT_USER_FAIL, this.onLoadCurrentUserFail
        );
    },

    onLoadCurrentUser: function (payload) {
        this.loading = true;
        this.emit("change");
    },

    onLoadCurrentUserSuccess: function (payload) {
        this.currentUser = payload.currentUser;
        this.loading = false;
        this.error = null;
        this.emit("change");
    },

    onLoadCurrentUserFail: function (payload) {
        this.loading = false;
        this.error = payload.error;
        this.emit("change");
    }
});

module.exports = CurrentUserStore;