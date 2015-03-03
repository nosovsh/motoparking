var React = require("react"),
    Fluxxor = require("fluxxor");

require("./style.css");
var L = require("leaflet");
L.Icon.Default.imagePath = 'path-to-your-leaflet-images-folder';
require("leaflet/dist/leaflet.css");

var $ = require("jquery");

// Require React-Router
var Router = require('react-router');
var Route = Router.Route;
var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var RouteHandler = Router.RouteHandler;
var Navigation = require('react-router/modules/mixins/Navigation');

var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var images = {
    "is-secure_maybe": require("./images/marker-mot.svg"),
    "is-secure_no": require("./images/marker-mot-no.svg"),
    "is-secure_yes_is-moto_maybe": require("./images/marker-mot-maybe.svg"),
    "is-secure_yes_is-moto_no": require("./images/marker-mot-crossed.svg"),
    "is-secure_yes_is-moto_yes": require("./images/marker-mot.svg")
};

var activeImages = {
    "": require("./images/marker-undefined.svg"),
    "is-secure_maybe": require("./images/marker-mot-active.svg"),
    "is-secure_no": require("./images/marker-mot-no-active.svg"),
    "is-secure_yes_is-moto_maybe": require("./images/marker-mot-maybe-active.svg"),
    "is-secure_yes_is-moto_no": require("./images/marker-mot-crossed-active.svg"),
    "is-secure_yes_is-moto_yes": require("./images/marker-mot-active.svg")
};

var getStatusName = function (isSecure, isMoto) {
    return (isSecure ? 'is-secure_' + isSecure : "") +
            (isMoto ? '_is-moto_' + isMoto : "");
}

var getIcon = function(is_secure, is_moto) {
    return L.icon({
        iconUrl: images[getStatusName(is_secure, is_moto)],
        iconSize:     [39, 42], // size of the icon
        iconAnchor:   [39, 42] // point of the icon which will correspond to marker's location
    });
};
var resizeIcon = L.icon({
    iconUrl: require("./images/marker-resize.svg"),
    iconSize: [39, 42], // size of the icon
    iconAnchor: [39, 42] // point of the icon which will correspond to marker's location
});

var getActiveIcon = function(is_secure, is_moto) {
    return L.icon({
        iconUrl: activeImages[getStatusName(is_secure, is_moto)],
        iconSize:     [39, 42], // size of the icon
        iconAnchor:   [39, 42] // point of the icon which will correspond to marker's location
    });
};

var Map = React.createClass({
	mixins: [Navigation, FluxMixin],
	getInitialState: function() {
        this.parkingMarkers = {};
        this.parkings = {};
        this.newParkingMarker = null;
		return {
			width: $(window).width(),
			height: $(window).height()
		}
	},
    componentDidMount: function() {
        this.map = L.map(this.getDOMNode(), {
			center: [55.7522200, 37.6155600],
			zoom: 12,
            minZoom: 2,
            maxZoom: 20,
            zoomControl: false,
            layers: [
                L.tileLayer(
                    'https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png',
                    {attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                    'Imagery © <a href="http://mapbox.com">Mapbox</a>',
                id: 'trashgenerator.ih4locjo'})
            ],

            attributionControl: false
        });
        this.getFlux().store("ParkingStore")
            .on("loadParkingListSuccess", this._loadParkingListSuccess)
            .on("loadCurrentParking", this._loadCurrentParking)
            .on("unselectCurrentParking", this._unselectCurrentParking)
            .on("editLocation", this._editLocation)
            .on("editLocationCancel", this._editLocationCancel)
            .on("editLocationDone", this._editLocationDone)
            .on("newParkingEditingLocation", this._newParkingEditingLocation)
            .on("newParkingEditingLocationCancel", this._newParkingEditingLocationCancel)
            .on("newParkingEditInfo", this._newParkingEditInfo)
            .on("newParkingEditInfoCancel", this._newParkingEditInfoCancel)
            .on("saveNewParkingSuccess", this._saveNewParkingSuccess)
        this.getFlux().actions.loadParkingList();

    },
    componentWillUnmount: function() {
        this.map = null;
    },
    render: function() {
        // style={{width:this.state.width, height: this.state.height}}
        return (
            <div className='map'></div>
        );
    },
	onMarkerClick: function (id) {
		this.transitionTo("Parking", {"id": id});
	},

    _loadParkingListSuccess: function() {
        var store = this.getFlux().store("ParkingStore");
        _.forEach(store.parkingList, function (parking) {
            if (store.currentParkingId && parking.id == store.currentParkingId) {
                var ic = getActiveIcon(parking.isSecure, parking.isMoto);
                this.map.panTo(parking.latLng.coordinates);
            } else {
                ic = getIcon(parking.isSecure, parking.isMoto);
            }
            this.parkingMarkers[parking.id] = L.marker(parking.latLng.coordinates, {icon: ic}).on('click', this.onMarkerClick.bind(this, parking.id)).addTo(this.map);
        }.bind(this));
        console.log(this.parkingMarkers)
    },

    _loadCurrentParking: function () {
        var store = this.getFlux().store("ParkingStore");
        _.map(this.parkingMarkers, function (marker, parkingId) {
            marker.setIcon(getIcon(store.getParking(parkingId).isSecure, store.getParking(parkingId).isMoto));
        }.bind(this));
        if (this.parkingMarkers[store.currentParkingId]) {
            this.parkingMarkers[store.currentParkingId].setIcon(getActiveIcon(store.getCurrentParking().isSecure, store.getCurrentParking().isMoto));
            this.map.panTo(this.parkingMarkers[store.currentParkingId].getLatLng());
        }
    },

    _unselectCurrentParking: function() {
        this._unselectAllMarkers()
    },

    /**
     * make current marker parking draggable. update store, when dragged
     * @private
     */
    _editLocation: function() {
        var store = this.getFlux().store("ParkingStore");

        var oldMarker = this.parkingMarkers[store.currentParkingId];

        this.parkingMarkers[store.currentParkingId] = L.marker(oldMarker.getLatLng(), {
            icon: resizeIcon,
            draggable: true
        }).addTo(this.map);

        this.parkingMarkers[store.currentParkingId].on('dragend', function (e) {
            this.getFlux().actions.changeCurrentParkingTemporaryPosition(
                this.parkingMarkers[store.currentParkingId].getLatLng()
            );
        }.bind(this));

        this.map.panTo(oldMarker.getLatLng());

        this.map.removeLayer(oldMarker);

        setTimeout(function () {
            this.getFlux().actions.changeCurrentParkingTemporaryPosition(
                this.parkingMarkers[store.currentParkingId].getLatLng()
            );
        }.bind(this), 0)
    },

    /**
     * make current parking marking not draggable
     * @private
     */
    _editLocationDone: function() {
        var store = this.getFlux().store("ParkingStore");

        var oldMarker = this.parkingMarkers[store.currentParkingId];

        this.parkingMarkers[store.currentParkingId] = L.marker(oldMarker.getLatLng(), {
            icon: getActiveIcon(store.getCurrentParking().isSecure, store.getCurrentParking().isMoto),
            draggable: false
        }).on('click', this.onMarkerClick.bind(this, store.currentParkingId))
            .addTo(this.map);

        this.map.removeLayer(oldMarker);

        this.map.panTo(oldMarker.getLatLng());
    },

    /**
     * make current parking marking not draggable
     * TODO: same as _editLocationDone
     * @private
     */
    _editLocationCancel: function() {
        var store = this.getFlux().store("ParkingStore");

        var oldMarker = this.parkingMarkers[store.currentParkingId];

        this.parkingMarkers[store.currentParkingId] = L.marker(store.getCurrentParking().latLng.coordinates, {
            icon: getActiveIcon(store.getCurrentParking().isSecure, store.getCurrentParking().isMoto),
            draggable: false
        }).on('click', this.onMarkerClick.bind(this, store.currentParkingId))
            .addTo(this.map);

        this.map.removeLayer(oldMarker);

        this.map.panTo(store.getCurrentParking().latLng.coordinates);
    },
    /**
     * Create draggable marker for new parking at map center. Update store, when dragged
     * @private
     */
    _newParkingEditingLocation: function() {
        var store = this.getFlux().store("ParkingStore");

        this._unselectAllMarkers();

        if (!store.newParking.latLng) {
            var initialMarkerPosition = this.map.getCenter();

            this.newParkingMarker = L.marker(initialMarkerPosition, {
                icon: resizeIcon,
                draggable: true
            }).addTo(this.map);

            setTimeout(function () {
                this.getFlux().actions.newParkingUpdateData({
                    latLng: {
                        type: "Point",
                        coordinates: [this.newParkingMarker.getLatLng().lat, this.newParkingMarker.getLatLng().lng]
                    }
                });
            }.bind(this), 0)
        } else {
        }

        this.newParkingMarker.dragging.enable();

        this.newParkingMarker.on('dragend', function (e) {
            this.getFlux().actions.newParkingUpdateData({
                latLng: {
                    type: "Point",
                    coordinates: [this.newParkingMarker.getLatLng().lat, this.newParkingMarker.getLatLng().lng]
                }
            });
        }.bind(this));

    },

    _newParkingEditingLocationCancel: function () {
        this.map.removeLayer(this.newParkingMarker);
        this.newParkingMarker = null;
        setTimeout(function() {
            this.transitionTo("Default")
        }.bind(this), 0);
    },

    /**
     * Make new parking marker not draggable
     * @private
     */
    _newParkingEditInfo: function() {
        var store = this.getFlux().store("ParkingStore");

        this.map.removeLayer(this.newParkingMarker);

        this.newParkingMarker = L.marker(store.newParking.latLng.coordinates, {
            icon: getActiveIcon(),
            draggable: false
        }).addTo(this.map);

    },

    _newParkingEditInfoCancel: function () {
        this.map.removeLayer(this.newParkingMarker);
        this.newParkingMarker = null;
        setTimeout(function() {
            this.transitionTo("Default")
        }.bind(this), 0);
    },


    _saveNewParkingSuccess: function() {
        var store = this.getFlux().store("ParkingStore");
        this.parkingMarkers[store.currentParkingId] = this.newParkingMarker; // TODO: do it not throws currentParkingId
        this.newParkingMarker.on("click", this.onMarkerClick.bind(this, store.currentParkingId));
        this.newParkingMarker = null;
        setTimeout(function() {
            this.transitionTo("Parking", {"id": store.currentParkingId})
        }.bind(this), 0);
    },


    _unselectAllMarkers: function () {
        var store = this.getFlux().store("ParkingStore");

        _.map(this.parkingMarkers, function (marker, parkingId) {
            marker.setIcon(getIcon(store.getParking(parkingId).isSecure, store.getParking(parkingId).isMoto));
        }.bind(this));
    }
});

module.exports = Map;