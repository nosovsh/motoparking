var LOCATION_TIMEOUT = 1 * 60 * 1000;

/**
 * Finds current location of user and draws circles at those coordinates
 *
 * @param map
 * @param errorHandler
 * @constructor
 */
var MyLocation = function(map, errorHandler) {
  this.map = map;
  this.errorHandler = errorHandler;
  this.removeTimeoutId = null;
  this.relocationCount = 0;
  this.relocationTimeoutId = null;
  this.shouldMoveToLocation = false;
  this.lastLatLng = null;

  this.map.on("locationfound", function(e) {
    this.setLocation(e);
    console.log("locationfound");
    if (this.shouldMoveToLocation) {
      this.map.panTo(e.latlng);
      this.shouldMoveToLocation = false;
    }
    this.lastLatLng = e.latlng;
  }.bind(this));


  this.map.on("locationerror", function(e) {
    console.log(e.message);
    this.errorHandler(e);
    this.lastLatLng = null;
    this.remove();
  }.bind(this));
};

MyLocation.prototype.locate = function(options) { // eslint-disable-line no-unused-vars
  this.relocationCount = 0;
  this.shouldMoveToLocation = true;
  if (this.lastLatLng) {
    this.map.panTo(this.lastLatLng);
  }
  clearTimeout(this.relocationTimeoutId);
  clearTimeout(this.removeTimeoutId);

  this.removeTimeoutId = setTimeout(function() {
    this.remove();
    this.map.stopLocate();
  }.bind(this), LOCATION_TIMEOUT);

  this.relocate({enableHighAccuracy: true, watch: true});
};

MyLocation.prototype.relocate = function(options) {
  console.log("relocating " + this.relocationCount);
  this.map.locate(options);
};

MyLocation.prototype.setLocation = function(e) {
  this.remove();

  var radius = e.accuracy / 2;

  this.circle1 = L.circle(e.latlng, radius, {
    stroke: false,
    color: "#4285F4"
  }).addTo(this.map);

  this.circle2 = L.circleMarker(e.latlng, {
    radius: 3,
    stroke: false,
    fillColor: "#4285F4",
    fillOpacity: 1
  }).addTo(this.map);

  this.circle3 = L.circleMarker(e.latlng, {
    radius: 4,
    stroke: true,
    color: "#FFF",
    opacity: 1,
    weight: 0.3,
    fill: false
  }).addTo(this.map);
};

/**
 * Hide circles
 */
MyLocation.prototype.remove = function() {
  if (this.circle1 && this.circle2 && this.circle3) {
    this.map.removeLayer(this.circle1);
    this.map.removeLayer(this.circle2);
    this.map.removeLayer(this.circle3);
  }
};

var myLocation = function(map, errorHandler) {
  return new MyLocation(map, errorHandler);
};

module.exports = myLocation;
