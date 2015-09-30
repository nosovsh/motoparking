var AppConstants = require("./AppConstants");

var AppActions = {
  mapZoomIn: function() {
    this.dispatch(AppConstants.MAP_ZOOM_IN, {});
  },
  mapZoomOut: function() {
    this.dispatch(AppConstants.MAP_ZOOM_OUT, {});
  },
  mapMyLocation: function() {
    this.dispatch(AppConstants.MAP_MY_LOCATION, {});
  }
};

module.exports = AppActions;
