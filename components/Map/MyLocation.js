var LOCATION_TIMEOUT = 5 * 60 * 1000;
var MAX_RELOCATIONS = 5;
var RELOCATION_TIME = 5 * 1000;

var MyLocation = function (map) {
    this.map = map;
    this.removeTimeoutId = null;
    this.relocationCount = 0;
    this.relocationTimeoutId = null;

    this.map.on('locationfound', function (e) {
        this.setLocation(e);
        console.log("locationfound");
        if (this.relocationCount < MAX_RELOCATIONS) {
            this.relocationTimeoutId = setTimeout(function () {
                this.relocate({setView: false});
            }.bind(this), RELOCATION_TIME);
            this.relocationCount++;
        }
    }.bind(this));

    this.map.on('locationerror', function (e) {
        console.log(e.message);
        if (this.relocationCount < MAX_RELOCATIONS) {
            this.relocationTimeoutId = setTimeout(function () {
                this.relocate();
            }.bind(this), RELOCATION_TIME);
            this.relocationCount++;
        }

        this.remove();
    }.bind(this))
};

MyLocation.prototype.locate = function (options) {
    this.relocationCount = 0;
    clearTimeout(this.relocationTimeoutId);
    clearTimeout(this.removeTimeoutId);

    this.removeTimeoutId = setTimeout(function () {
        this.remove()
    }.bind(this), LOCATION_TIMEOUT);

    this.relocate(options);

};

MyLocation.prototype.relocate = function (options) {
    console.log("relocating " + this.relocationCount);
    this.map.locate(options);

};

MyLocation.prototype.setLocation = function (e) {

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

MyLocation.prototype.remove = function () {
    if (this.circle1 && this.circle2 && this.circle3) {
        this.map.removeLayer(this.circle1);
        this.map.removeLayer(this.circle2);
        this.map.removeLayer(this.circle3);
    }
};

var myLocation = function (map) {
    return new MyLocation(map)
};

module.exports = myLocation;