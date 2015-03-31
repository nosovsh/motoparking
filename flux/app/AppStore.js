var Fluxxor = require("fluxxor"),
    AppConstants = require("./AppConstants"),
    $ = require("jquery"),
    _ = require("lodash");

var AppStore = Fluxxor.createStore({
    initialize: function () {
        this.loading = false;
        this.error = null;
        this.commentsByParking = {};

        this.bindActions(
            AppConstants.MAP_ZOOM_IN, this.onMapZoomIn,
            AppConstants.MAP_ZOOM_OUT, this.onMapZoomOut,
            AppConstants.MAP_MY_LOCATION, this.onMapMyLocation
        );

        $( document ).ajaxError(function() {
            console.log("Global error handler");
        });
    },

    onMapZoomIn: function (payload) {
        this.emit(AppConstants.MAP_ZOOM_IN);
    },

    onMapZoomOut: function (payload) {
        this.emit(AppConstants.MAP_ZOOM_OUT);
    },

    onMapMyLocation: function (payload) {
        this.emit(AppConstants.MAP_MY_LOCATION);
    }

});

module.exports = AppStore;