var React = require("react");

require("./style.css");
var L = require("leaflet");
L.Icon.Default.imagePath = 'path-to-your-leaflet-images-folder'
require("leaflet/dist/leaflet.css");
var flux = require("../../fluxy")

var $ = require("jquery");

// Require React-Router
var Router = require('react-router');
var Route = Router.Route;
var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var RouteHandler = Router.RouteHandler;
var Navigation = require('react-router/modules/mixins/Navigation');

var icon = L.icon({
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    iconSize:     [25, 41], // size of the icon
    iconAnchor:   [25, 41] // point of the icon which will correspond to marker's location
});

var activeIcon = L.icon({
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    iconSize:     [35, 46], // size of the icon
    iconAnchor:   [35, 46] // point of the icon which will correspond to marker's location
});

var Map = React.createClass({
	mixins: [Navigation],
	getInitialState: function() {
        this.parkingMarkers = {};
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
        flux.store("ParkingStore")
            .on("loadParkingListSuccess", this._loadParkingListSuccess)
            .on("loadCurrentParking", this._loadCurrentParking)
            .on("unselectCurrentParking", this._unselectCurrentParking)
        flux.actions.loadParkingList();

    },
    componentWillUnmount: function() {
        this.map = null;
    },
    render: function() {
        return (
            <div className='map' style={{width:this.state.width, height: this.state.height}}></div>
        );
    },
	onMarkerClick: function (id) {
		this.transitionTo("Parking", {"id": id});
	},

    _loadParkingListSuccess: function() {
        var store = flux.store("ParkingStore");
        _.forEach(store.parkingList, function (parking) {
            var ic = store.currentParkingId && parking.id == store.currentParkingId ? activeIcon : icon
            this.parkingMarkers[parking.id] = L.marker(parking.latLng.coordinates, {icon: ic}).on('click', this.onMarkerClick.bind(this, parking.id)).addTo(this.map);
        }.bind(this));
        console.log(this.parkingMarkers)
    },

    _loadCurrentParking: function () {
        var store = flux.store("ParkingStore");
        _.map(this.parkingMarkers, function (marker, parkingId) {
            marker.setIcon(icon);
        });
        if (this.parkingMarkers[store.currentParkingId]) {
            this.parkingMarkers[store.currentParkingId].setIcon(activeIcon);
        }
    },

    _unselectCurrentParking: function() {
        _.map(this.parkingMarkers, function (marker, parkingId) {
            marker.setIcon(icon);
        });
    }
});

module.exports = Map;