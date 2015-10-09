var React = require("react");
var Fluxxor = require("fluxxor");

var L = require("leaflet");
var leafletProviders = require("leaflet-providers");
require("leaflet/dist/leaflet.css");

var Router = require("react-router");
var History = Router.History;

var FluxMixin = Fluxxor.FluxMixin(React);

var AppConstants = require("../../../flux/app/AppConstants");
var myLocation = require("./MyLocation");


var images = {
  "is-secure_maybe_is-moto_maybe": require("./images/marker-is-secure_maybe_is-moto_maybe.svg"),
  "is-secure_no_is-moto_maybe": require("./images/marker-is-secure_no_is-moto_maybe.svg"),
  "is-secure_yes_is-moto_maybe": require("./images/marker-is-secure_yes_is-moto_maybe.svg"),
  "is-secure_yes_is-moto_no": require("./images/marker-is-secure_yes_is-moto_no.svg"),
  "is-secure_yes_is-moto_yes": require("./images/marker-is-secure_yes_is-moto_yes.svg")
};

var activeImages = {
  "": require("./images/marker-undefined.svg"),
  "is-secure_maybe_is-moto_maybe": require("./images/marker-is-secure_maybe_is-moto_maybe-active.svg"),
  "is-secure_no_is-moto_maybe": require("./images/marker-is-secure_no_is-moto_maybe-active.svg"),
  "is-secure_yes_is-moto_maybe": require("./images/marker-is-secure_yes_is-moto_maybe-active.svg"),
  "is-secure_yes_is-moto_no": require("./images/marker-is-secure_yes_is-moto_no-active.svg"),
  "is-secure_yes_is-moto_yes": require("./images/marker-is-secure_yes_is-moto_yes-active.svg")
};

var getStatusName = function(isSecure, isMoto) {
  return (isSecure ? "is-secure_" + isSecure : "") +
    (isMoto ? "_is-moto_" + isMoto : "");
};

var getIcon = function(isSecure, isMoto) {
  return L.icon({
    iconUrl: images[getStatusName(isSecure, isMoto)],
    iconSize: [39, 42], // size of the icon
    iconAnchor: [19, 41] // point of the icon which will correspond to marker's location
  });
};
var resizeIcon = L.icon({
  iconUrl: require("./images/marker-resize.svg"),
  iconSize: [48, 52], // size of the icon
  iconAnchor: [24, 51] // point of the icon which will correspond to marker's location
});

var getActiveIcon = function(isSecure, isMoto) {
  return L.icon({
    iconUrl: activeImages[getStatusName(isSecure, isMoto)],
    iconSize: [48, 52], // size of the icon
    iconAnchor: [24, 51] // point of the icon which will correspond to marker's location
  });
};

/**
 * Map component.
 *
 * This component is writen in really bad manner because it connects React with non-reactive Leaflet.js
 * It subscribes to Flux events and calls leaflet handlers
 * TODO: rewrite it in React style!
 */
var Map = React.createClass({
  mixins: [History, FluxMixin],

  getInitialState: function() {
    this.parkingMarkers = {};
    this.newParkingMarker = null;
    return {};
  },

  componentDidMount: function() {
    this.map = L.map(this.getDOMNode(), {
      center: [55.7522200, 37.6155600],
      zoom: 12,
      minZoom: 2,
      maxZoom: 20,
      zoomControl: false,
      layers: [
        L.tileLayer.provider("MapBox.trashgenerator.ih4locjo")
      ],
      attributionControl: true
    });
    this.map.attributionControl.setPrefix("");

    // subscribing to events
    this.getFlux().store("ParkingStore")
      .on("loadParkingListSuccess", this._loadParkingListSuccess)
      .on("loadCurrentParking", this._loadCurrentParking)
      .on("loadCurrentParkingSuccess", this._loadCurrentParkingSuccess)
      .on("unselectCurrentParking", this._unselectCurrentParking)
      .on("editLocation", this._editLocation)
      .on("editLocationCancel", this._editLocationCancel)
      .on("editLocationDone", this._editLocationDone)
      .on("newParking", this._newParking)
      .on("saveNewParkingSuccess", this._saveNewParkingSuccess);

    this.getFlux().store("AppStore")
      .on(AppConstants.MAP_ZOOM_IN, this._mapZoomIn)
      .on(AppConstants.MAP_ZOOM_OUT, this._mapZoomOut)
      .on(AppConstants.MAP_MY_LOCATION, this._mapMyLocation);

    this.getFlux().actions.loadParkingList();

    this.myLocation = myLocation(this.map, this._onLocationError);
  },

  componentWillUnmount: function() {
    this.map = null;
  },

  onMarkerClick: function(id) {
    this.history.pushState(null, "/p/" + id);
  },

  /**
   * Draw parkings markers
   * @private
   */
  _loadParkingListSuccess: function() {
    var store = this.getFlux().store("ParkingStore");
    _.forEach(store.parkingList, function(parking) {
      var icon;
      if (store.currentParkingId && parking.id === store.currentParkingId) {
        icon = getActiveIcon(parking.isSecure, parking.isMoto);
        this.map.panTo(parking.latLng.coordinates);
      } else {
        icon = getIcon(parking.isSecure, parking.isMoto);
      }
      if (this.map) {
        this.parkingMarkers[parking.id] = L.marker(
          parking.latLng.coordinates,
          {icon: icon}
        );

        this.parkingMarkers[parking.id].on("click", this.onMarkerClick.bind(this, parking.id))
          .addTo(this.map);
      }
    }.bind(this));
    // hack to rerender map because sometimes only part of map is rendered
    this.map._onResize();
  },

  /**
   * Draw selected marker and pan map to it
   * @private
   */
  _loadCurrentParking: function() {
    var store = this.getFlux().store("ParkingStore");

    this._unselectAllMarkers();

    if (this.parkingMarkers[store.currentParkingId]) {
      this.parkingMarkers[store.currentParkingId].setIcon(getActiveIcon(store.getCurrentParking().isSecure, store.getCurrentParking().isMoto));
      this.map.panTo(this.parkingMarkers[store.currentParkingId].getLatLng());
    }
  },

  /**
   * Draw selected marker
   * @private
   */
  _loadCurrentParkingSuccess: function() {
    var store = this.getFlux().store("ParkingStore");

    if (this.parkingMarkers[store.currentParkingId]) {
      this.parkingMarkers[store.currentParkingId].setIcon(getActiveIcon(store.getCurrentParking().isSecure, store.getCurrentParking().isMoto));
    }
  },

  /**
   * Draw unselected marker
   * @private
   */
  _unselectCurrentParking: function() {
    this._unselectAllMarkers();
  },

  /**
   * make current marker parking draggable. Update store, when dragged
   * @private
   */
  _editLocation: function() {
    var store = this.getFlux().store("ParkingStore");

    var oldMarker = this.parkingMarkers[store.currentParkingId];

    this.parkingMarkers[store.currentParkingId] = L.marker(oldMarker.getLatLng(), {
      icon: resizeIcon,
      draggable: true
    }).addTo(this.map);

    this.parkingMarkers[store.currentParkingId].on("dragend", function(e) { // eslint-disable-line no-unused-vars
      this.getFlux().actions.changeCurrentParkingTemporaryPosition(
        this.parkingMarkers[store.currentParkingId].getLatLng()
      );
    }.bind(this));

    this.map.panTo(oldMarker.getLatLng());

    this.map.removeLayer(oldMarker);

    setTimeout(function() {
      this.getFlux().actions.changeCurrentParkingTemporaryPosition(
        this.parkingMarkers[store.currentParkingId].getLatLng()
      );
    }.bind(this), 0);
  },

  /**
   * Make current parking marking not draggable
   * @private
   */
  _editLocationDone: function() {
    var store = this.getFlux().store("ParkingStore");

    var oldMarker = this.parkingMarkers[store.currentParkingId];

    this.parkingMarkers[store.currentParkingId] = L.marker(oldMarker.getLatLng(), {
      icon: getActiveIcon(store.getCurrentParking().isSecure, store.getCurrentParking().isMoto),
      draggable: false
    }).on("click", this.onMarkerClick.bind(this, store.currentParkingId))
      .addTo(this.map);

    this.map.removeLayer(oldMarker);

    this.map.panTo(oldMarker.getLatLng());
  },

  /**
   * Make current parking marking not draggable
   * TODO: same as _editLocationDone
   * @private
   */
  _editLocationCancel: function() {
    var store = this.getFlux().store("ParkingStore");

    var oldMarker = this.parkingMarkers[store.currentParkingId];

    this.parkingMarkers[store.currentParkingId] = L.marker(store.getCurrentParking().latLng.coordinates, {
      icon: getActiveIcon(store.getCurrentParking().isSecure, store.getCurrentParking().isMoto),
      draggable: false
    }).on("click", this.onMarkerClick.bind(this, store.currentParkingId))
      .addTo(this.map);

    this.map.removeLayer(oldMarker);

    this.map.panTo(store.getCurrentParking().latLng.coordinates);
  },

  /**
   * Create draggable marker for new parking at map center. Update store, when dragged
   * @private
   */
  _newParking: function() {
    var store = this.getFlux().store("ParkingStore");

    this._unselectAllMarkers();

    if (!store.newParking.latLng) {
      // set point 100 pixels higher than center
      var currentCenter = this.map.getCenter();
      var targetPoint = this.map.project(currentCenter).subtract([0, -100]);
      var targetLatLng = this.map.unproject(targetPoint);
      // var initialMarkerPosition = this.map.getCenter();
      console.log(targetLatLng);
      this.map.panTo(targetLatLng);
      var initialMarkerPosition = currentCenter;

      this.newParkingMarker = L.marker(initialMarkerPosition, {
        icon: resizeIcon,
        draggable: true
      }).addTo(this.map);

      setTimeout(function() {
        this.getFlux().actions.newParkingUpdateData({
          latLng: {
            type: "Point",
            coordinates: [this.newParkingMarker.getLatLng().lat, this.newParkingMarker.getLatLng().lng]
          }
        });
      }.bind(this), 0);
    }

    this.newParkingMarker.dragging.enable();

    this.newParkingMarker.on("dragend", function(e) { // eslint-disable-line no-unused-vars
      this.getFlux().actions.newParkingUpdateData({
        latLng: {
          type: "Point",
          coordinates: [this.newParkingMarker.getLatLng().lat, this.newParkingMarker.getLatLng().lng]
        }
      });
    }.bind(this));
  },

  /**
   * Create new marker and select it
   * @private
   */
  _saveNewParkingSuccess: function() {
    var store = this.getFlux().store("ParkingStore");

    this.map.removeLayer(this.newParkingMarker);
    this.newParkingMarker = null;

    this.parkingMarkers[store.currentParkingId] = L.marker(store.getParking(store.currentParkingId).latLng.coordinates, {
      icon: resizeIcon,
      draggable: false
    }).on("click", this.onMarkerClick.bind(this, store.currentParkingId))
      .addTo(this.map); // TODO: should be done without currentParkingId
    setTimeout(function() {
      this.history.pushState(null, "/p/" + store.currentParkingId);
    }.bind(this), 0);
  },

  /**
   * Mark all markers as unselected
   * @private
   */
  _unselectAllMarkers: function() {
    var store = this.getFlux().store("ParkingStore");

    _.map(this.parkingMarkers, function(marker, parkingId) {
      marker
        .setIcon(getIcon(store.getParking(parkingId).isSecure, store.getParking(parkingId).isMoto))
        .dragging.disable();
    });

    if (this.newParkingMarker) {
      this.map.removeLayer(this.newParkingMarker);
      this.newParkingMarker = null;
    }
  },

  _mapZoomIn: function() {
    this.map.zoomIn();
  },

  _mapZoomOut: function() {
    this.map.zoomOut();
  },

  _mapMyLocation: function() {
    this.myLocation.locate();
  },

  _onLocationError: function(e) { // eslint-disable-line no-unused-vars
    this.getFlux().actions.errorToast("Не получается определить Ваше местоположение.");
  },

  render: function() {
    return (
      <div className="map" id="map"></div>
    );
  }
});

module.exports = Map;
