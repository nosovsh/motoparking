var React = require("react"),
    Fluxxor = require("fluxxor");

require("./style.css");
var L = require("leaflet"),
    leafletProviders = require("leaflet-providers");
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
var Navigation = Router.Navigation;

var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var AppConstants = require("../../flux/app/AppConstants"),
    myLocation = require("./MyLocation");

var images = {
    "is-secure_maybe_is-moto_maybe": require("./images/marker-is-secure_maybe_is-moto_maybe.svg"),
    "is-secure_no_is-moto_maybe": require("./images/marker-mot-no.svg"),
    "is-secure_yes_is-moto_maybe": require("./images/marker-mot-maybe.svg"),
    "is-secure_yes_is-moto_no": require("./images/marker-mot-crossed.svg"),
    "is-secure_yes_is-moto_yes": require("./images/marker-mot.svg")
};

var activeImages = {
    "": require("./images/marker-undefined.svg"),
    "is-secure_maybe_is-moto_maybe": require("./images/marker-is-secure_maybe_is-moto_maybe-active.svg"),
    "is-secure_no_is-moto_maybe": require("./images/marker-mot-no-active.svg"),
    "is-secure_yes_is-moto_maybe": require("./images/marker-mot-maybe-active.svg"),
    "is-secure_yes_is-moto_no": require("./images/marker-mot-crossed-active.svg"),
    "is-secure_yes_is-moto_yes": require("./images/marker-mot-active.svg")
};

var getStatusName = function (isSecure, isMoto) {
    return (isSecure ? 'is-secure_' + isSecure : "") +
        (isMoto ? '_is-moto_' + isMoto : "");
}

var getIcon = function (is_secure, is_moto) {
    return L.icon({
        iconUrl: images[getStatusName(is_secure, is_moto)],
        iconSize: [39, 42], // size of the icon
        iconAnchor: [19, 41] // point of the icon which will correspond to marker's location
    });
};
var resizeIcon = L.icon({
    iconUrl: require("./images/marker-resize1.svg"),
    iconSize: [48, 52], // size of the icon
    iconAnchor: [24, 51] // point of the icon which will correspond to marker's location
});

var getActiveIcon = function (is_secure, is_moto) {
    return L.icon({
        iconUrl: activeImages[getStatusName(is_secure, is_moto)],
        iconSize: [48, 52], // size of the icon
        iconAnchor: [24, 51] // point of the icon which will correspond to marker's location
    });
};

var Map = React.createClass({
    mixins: [Navigation, FluxMixin],
    getInitialState: function () {
        this.parkingMarkers = {};
        this.parkings = {};
        this.newParkingMarker = null;
        return {
            width: $(window).width(),
            height: $(window).height()
        }
    },
    componentDidMount: function () {
        var p=1;
        this.map = L.map("map", {
            center: [55.7522200, 37.6155600],
            zoom: 12,
            minZoom: 2,
            maxZoom: 20,
            zoomControl: false,
            layers: [
                L.tileLayer.provider('MapBox.trashgenerator.ih4locjo')
            ],

            attributionControl: false
        });
        this.getFlux().store("ParkingStore")
            .on("loadParkingListSuccess", this._loadParkingListSuccess)
            .on("loadCurrentParking", this._loadCurrentParking)
            .on("loadCurrentParkingSuccess", this._loadCurrentParkingSuccess)
            .on("unselectCurrentParking", this._unselectCurrentParking)
            .on("editLocation", this._editLocation)
            .on("editLocationCancel", this._editLocationCancel)
            .on("editLocationDone", this._editLocationDone)
            .on("newParking", this._newParking)
            .on("saveNewParkingSuccess", this._saveNewParkingSuccess)

        this.getFlux().store("AppStore")
            .on(AppConstants.MAP_ZOOM_IN, this._mapZoomIn)
            .on(AppConstants.MAP_ZOOM_OUT, this._mapZoomOut)
            .on(AppConstants.MAP_MY_LOCATION, this._mapMyLocation)

        this.getFlux().actions.loadParkingList();

        this.myLocation = myLocation(this.map, this._onLocationError);

    },
    componentWillUnmount: function () {
        this.map = null;
    },
    render: function () {
        // style={{width:this.state.width, height: this.state.height}}
        return (
            <div className='map' id="map"></div>
        );
    },
    onMarkerClick: function (id) {
        this.transitionTo("Parking", {"id": id});
    },

    _loadParkingListSuccess: function () {
        var store = this.getFlux().store("ParkingStore");
        _.forEach(store.parkingList, function (parking) {
            if (store.currentParkingId && parking.id == store.currentParkingId) {
                var ic = getActiveIcon(parking.isSecure, parking.isMoto);
                this.map.panTo(parking.latLng.coordinates);
            } else {
                ic = getIcon(parking.isSecure, parking.isMoto);
            }
            if (this.map) {
                this.parkingMarkers[parking.id] = L.marker(
                    parking.latLng.coordinates,
                    {icon: ic}
                )

                this.parkingMarkers[parking.id].on('click', this.onMarkerClick.bind(this, parking.id))
                    .addTo(this.map);
            }
        }.bind(this));
        console.log(this.parkingMarkers)
    },

    _loadCurrentParking: function () {
        var store = this.getFlux().store("ParkingStore");

        this._unselectAllMarkers();

        if (this.parkingMarkers[store.currentParkingId]) {
            this.parkingMarkers[store.currentParkingId].setIcon(getActiveIcon(store.getCurrentParking().isSecure, store.getCurrentParking().isMoto));
            this.map.panTo(this.parkingMarkers[store.currentParkingId].getLatLng());
        }
    },

    _loadCurrentParkingSuccess: function () {
        var store = this.getFlux().store("ParkingStore");

        if (this.parkingMarkers[store.currentParkingId]) {
            this.parkingMarkers[store.currentParkingId].setIcon(getActiveIcon(store.getCurrentParking().isSecure, store.getCurrentParking().isMoto));
        }
    },

    _unselectCurrentParking: function () {
        this._unselectAllMarkers()
    },

    /**
     * make current marker parking draggable. update store, when dragged
     * @private
     */
    _editLocation: function () {
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
    _editLocationDone: function () {
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
    _editLocationCancel: function () {
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
    _newParking: function () {
        var store = this.getFlux().store("ParkingStore");

        this._unselectAllMarkers();

        if (!store.newParking.latLng) {
            console.log("1111")


            // set point 100 pixels higher than center
            var currentCenter = this.map.getCenter(),
                targetPoint = this.map.project(currentCenter).subtract([0, -100]),
                targetLatLng = this.map.unproject(targetPoint);
            //var initialMarkerPosition = this.map.getCenter();
            console.log(targetLatLng);
            this.map.panTo(targetLatLng);
            var initialMarkerPosition = currentCenter;

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

    _saveNewParkingSuccess: function () {
        var store = this.getFlux().store("ParkingStore");

        this.map.removeLayer(this.newParkingMarker);
        this.newParkingMarker = null;

        this.parkingMarkers[store.currentParkingId] = L.marker(store.getParking(store.currentParkingId).latLng.coordinates, {
            icon: resizeIcon,
            draggable: false
        }).on("click", this.onMarkerClick.bind(this, store.currentParkingId))
            .addTo(this.map); // TODO: do it not throws currentParkingId
        setTimeout(function () {
            this.transitionTo("Parking", {"id": store.currentParkingId})
        }.bind(this), 0);
    },


    _unselectAllMarkers: function () {
        var store = this.getFlux().store("ParkingStore");

        _.map(this.parkingMarkers, function (marker, parkingId) {
            marker
                .setIcon(getIcon(store.getParking(parkingId).isSecure, store.getParking(parkingId).isMoto))
                .dragging.disable();
        }.bind(this));

        if (this.newParkingMarker) {
            this.map.removeLayer(this.newParkingMarker);
            this.newParkingMarker = null;
        }
    },

    _mapZoomIn: function () {
        this.map.zoomIn();
    },

    _mapZoomOut: function () {
        this.map.zoomOut();
    },

    _mapMyLocation: function () {
        this.myLocation.locate()
    },

    _onLocationError: function (e) {
        this.getFlux().actions.errorToast("Не получается определить Ваше местоположение.")
    }
});

module.exports = Map;