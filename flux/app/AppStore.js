var Fluxxor = require("fluxxor"),
    AppConstants = require("./AppConstants"),
    $ = require("jquery"),
    _ = require("lodash"),
    analytics = require('../../utils/analytics');


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

        $(document).ajaxError(function (e, jqXHR, ajaxSettings, exception) {
            console.log("Global error handler");
            this.flux.actions.errorToast("Что то не так. \nЛибо с интернетом, либо с нашим сервером. Попробуйте еще раз.")
        }.bind(this));
    },

    onMapZoomIn: function (payload) {
        this.emit(AppConstants.MAP_ZOOM_IN);
    },

    onMapZoomOut: function (payload) {
        this.emit(AppConstants.MAP_ZOOM_OUT);
    },

    onMapMyLocation: function (payload) {
        analytics.event("MyLocation", "find");
        this.emit(AppConstants.MAP_MY_LOCATION);
    }

});

module.exports = AppStore;