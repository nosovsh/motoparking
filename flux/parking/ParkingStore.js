var Fluxxor = require("fluxxor"),
    ParkingConstants = require("./ParkingConstants"),
    _ = require("lodash");

var ParkingStore = Fluxxor.createStore({
    initialize: function () {
        this.loading = false;
        this.error = null;
        this.parkingList = [];
        this.currentParkingId = null;
        this.currentParking = {};

        this.bindActions(
            ParkingConstants.LOAD_CURRENT_PARKING, this.onLoadCurrentParking,
            ParkingConstants.LOAD_CURRENT_PARKING_SUCCESS, this.onLoadCurrentParkingSuccess,
            ParkingConstants.LOAD_CURRENT_PARKING_FAIL, this.onLoadCurrentParkingFail,

            ParkingConstants.LOAD_PARKING_LIST, this.onLoadParkingList,
            ParkingConstants.LOAD_PARKING_LIST_SUCCESS, this.onLoadParkingListSuccess,
            ParkingConstants.LOAD_PARKING_LIST_FAIL, this.onLoadParkingListFail
        );
    },

    onLoadCurrentParking: function (payload) {
        this.loading = true;
        this.currentParkingId = payload.parkingId;
        this.emit("change");
    },

    onLoadCurrentParkingSuccess: function (payload) {
        this.loading = false;
        this.error = null;

        this.currentParking = payload.parking;
        this.emit("change");
    },

    onLoadCurrentParkingFail: function (payload) {
        this.loading = false;
        this.error = payload.error;
        this.emit("change");
    },

    onLoadParkingList: function (payload) {
        this.loading = true;
        this.emit("change");
    },

    onLoadParkingListSuccess: function (payload) {
        this.loading = false;
        this.error = null;

        this.parkingList = payload.parkingList;
        this.emit("change");
        this.emit("loadParkingListSuccess");
    },

    onLoadParkingListFail: function (payload) {
        this.loading = false;
        this.error = payload.error;
        this.emit("change");
    }
});

module.exports = ParkingStore;