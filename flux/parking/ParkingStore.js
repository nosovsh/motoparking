var Fluxxor = require("fluxxor"),
    ParkingConstants = require("./ParkingConstants"),
    OpinionConstants = require("../opinion/OpinionConstants"),
    _ = require("lodash");

var ParkingStore = Fluxxor.createStore({
    initialize: function () {
        this.loading = false;
        this.error = null;
        this.parkingList = [];
        this.currentParkingId = null;
        this.editingLocation = false;
        this.currentParkingTemporaryPosition = null;

        this.bindActions(
            ParkingConstants.LOAD_CURRENT_PARKING, this.onLoadCurrentParking,
            ParkingConstants.LOAD_CURRENT_PARKING_SUCCESS, this.onLoadCurrentParkingSuccess,
            ParkingConstants.LOAD_CURRENT_PARKING_FAIL, this.onLoadCurrentParkingFail,

            ParkingConstants.UNSELECT_CURRENT_PARKING, this.onUnselectCurrentParking,

            ParkingConstants.LOAD_PARKING_LIST, this.onLoadParkingList,
            ParkingConstants.LOAD_PARKING_LIST_SUCCESS, this.onLoadParkingListSuccess,
            ParkingConstants.LOAD_PARKING_LIST_FAIL, this.onLoadParkingListFail,

            ParkingConstants.EDIT_LOCATION, this.onEditLocation,
            ParkingConstants.EDIT_LOCATION_DONE, this.onEditLocationDone,
            ParkingConstants.EDIT_LOCATION_CANCEL, this.onEditLocationCancel,

            OpinionConstants.POST_OPINION, this.onPostOpinion,
            //OpinionConstants.POST_OPINION_SUCCESS, this.onPostOpinionSuccess,
            //OpinionConstants.POST_OPINION_FAIL, this.onPostOpinionFail

            ParkingConstants.CHANGE_CURRENT_PARKING_TEMPORARY_POSITION, this.onChangeCurrentParkingTemporaryPosition
        );
    },

    onLoadCurrentParking: function (payload) {
        this.loading = true;
        this.currentParkingId = payload.parkingId;
        this.emit("change");
        this.emit("loadCurrentParking");
    },

    onLoadCurrentParkingSuccess: function (payload) {
        if (payload.parking.id == this.currentParkingId) {
            this.loading = false;
            this.error = null;
            this.updateParking(payload.parking);
            this.emit("change");
        }
    },

    onLoadCurrentParkingFail: function (payload) {
        this.loading = false;
        this.error = payload.error;
        this.emit("change");
    },

    onUnselectCurrentParking: function () {
        this.currentParkingId = null;
        this.emit("change");
        this.emit("unselectCurrentParking");
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
    },

    onPostOpinion: function (payload) {
        var parking = this.getParking(payload.opinion.parking);
        var newParking = _.merge(parking, {myOpinion: payload.opinion});
        this.updateParking(newParking);
        this.emit("change");
    },

    onEditLocation: function () {
        this.editingLocation = true;
        this.emit("change");
        this.emit("editLocation");
    },

    onEditLocationDone: function () {
        this.editingLocation = false;
        this.emit("change");
        this.emit("editLocationDone");
    },

    onEditLocationCancel: function () {
        this.editingLocation = false;
        this.currentParkingTemporaryPosition = null;
        this.emit("change");
        this.emit("editLocationCancel");
    },

    onChangeCurrentParkingTemporaryPosition: function (payload) {
        this.currentParkingTemporaryPosition = payload.latLng;
        this.emit("change");
    },

    getParking: function (id) {
        return _.find(this.parkingList, function(parking) {
            return parking.id == id
        }.bind(this))
    },

    updateParking: function (newParking) {
        _.map(this.parkingList, function(parking, i) {
            if(parking.id == newParking.id){
                this.parkingList[i] = newParking
            }
        }.bind(this))
    },

    getCurrentParking: function () {
        return _.find(this.parkingList, function(parking) {
            return parking.id == this.currentParkingId
        }.bind(this)) || {};
    },

    getMyOpinionOfCurrentParking: function () {
        return this.getCurrentParking()["myOpinion"] || {}
    }
});

module.exports = ParkingStore;