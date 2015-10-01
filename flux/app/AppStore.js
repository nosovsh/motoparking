var Fluxxor = require("fluxxor");
var AppConstants = require("./AppConstants");
var $ = require("jquery");
var analytics = require("../../utils/analytics");


var AppStore = Fluxxor.createStore({
  initialize: function() {
    this.bindActions(
      AppConstants.MAP_ZOOM_IN, this.onMapZoomIn,
      AppConstants.MAP_ZOOM_OUT, this.onMapZoomOut,
      AppConstants.MAP_MY_LOCATION, this.onMapMyLocation
    );

    $(document).ajaxError(function(e, jqXHR, ajaxSettings, exception) { // eslint-disable-line no-unused-vars
      console.log("Global error handler");
      this.flux.actions.errorToast("Что то не так. \nЛибо с интернетом, либо с нашим сервером. Попробуйте еще раз.");
    }.bind(this));
  },

  onMapZoomIn: function(payload) { // eslint-disable-line no-unused-vars
    this.emit(AppConstants.MAP_ZOOM_IN);
  },

  onMapZoomOut: function(payload) { // eslint-disable-line no-unused-vars
    this.emit(AppConstants.MAP_ZOOM_OUT);
  },

  onMapMyLocation: function(payload) { // eslint-disable-line no-unused-vars
    analytics.event("MyLocation", "find");
    this.emit(AppConstants.MAP_MY_LOCATION);
  }
});

module.exports = AppStore;
