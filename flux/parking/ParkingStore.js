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
        this.newParkingEditingLocation = false;
        this.newParkingEditInfo = false;
        this.newParking = {};

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
            OpinionConstants.POST_OPINION_SUCCESS, this.onPostOpinionSuccess,
            //OpinionConstants.POST_OPINION_FAIL, this.onPostOpinionFail

            ParkingConstants.CHANGE_CURRENT_PARKING_TEMPORARY_POSITION, this.onChangeCurrentParkingTemporaryPosition,

            ParkingConstants.NEW_PARKING_EDIT_LOCATION, this.onNewParkingEditLocation,
            ParkingConstants.NEW_PARKING_EDIT_LOCATION_CANCEL, this.onNewParkingEditLocationCancel,

            ParkingConstants.NEW_PARKING_EDIT_INFO, this.onNewParkingEditInfo,
            ParkingConstants.NEW_PARKING_EDIT_INFO_CANCEL, this.onNewParkingEditInfoCancel,

            ParkingConstants.NEW_PARKING_UPDATE_DATA, this.onNewParkingUpdateData,
            ParkingConstants.SAVE_NEW_PARKING_SUCCESS, this.onSaveNewParkingSuccess
        );
    },

    onLoadCurrentParking: function (payload) {
        this.loading = true;
        this.currentParkingId = payload.parkingId;
        this.emit("change");
        this.emit("loadCurrentParking");
    },

    onLoadCurrentParkingSuccess: function (payload) {
        var parking = _.extend({}, payload.parking, {isFullParkingLoaded: true});
        this.updateParking(parking);

        if (payload.parking.id == this.currentParkingId) {
            this.loading = false;
            this.error = null;
        }
        this.emit("change");
        this.emit("loadCurrentParkingSuccess")
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

    onPostOpinionSuccess: function (payload) {
        // TODO: надо подгружать не текущую парковку а просто парковку
        setTimeout(function () {
            this.flux.actions.loadCurrentParking(payload.opinion.parking);
        }.bind(this), 0);
        this.emit("change");
    },

    onEditLocation: function () {
        this.editingLocation = true;
        this.emit("change");
        this.emit("editLocation");
    },

    onEditLocationDone: function (payload) {
        this.editingLocation = false;
        var parking = this.getParking(payload.opinion.parking);
        parking.latLng = payload.opinion.latLng;
        this.currentParkingTemporaryPosition = null;
        this.updateParking(parking);
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

    onNewParkingEditLocation: function (payload) {
        this.newParkingEditInfo = false;
        this.newParkingEditingLocation = true;
        this.emit("change");
        this.emit("newParkingEditingLocation");
    },

    onNewParkingEditLocationCancel: function (payload) {
        this.newParkingEditingLocation = false;
        this.newParking = {};
        this.emit("change");
        this.emit("newParkingEditingLocationCancel");
    },

    onNewParkingEditInfo: function (payload) {
        this.newParkingEditingLocation = false;
        this.newParkingEditInfo = true;
        this.emit("change");
        this.emit("newParkingEditInfo");
    },

    onNewParkingEditInfoCancel: function (payload) {
        this.newParkingEditInfo = false;
        this.newParking = {};
        this.emit("change");
        this.emit("newParkingEditInfoCancel");
    },

    onNewParkingUpdateData: function (payload) {
        this.newParking = _.extend({}, this.newParking, payload.data);
        this.emit("change");
    },

    onSaveNewParkingSuccess: function (payload) {
        console.log("wwwww")
        this.newParkingEditInfo = false;
        this.currentParkingId = payload.opinion.parking; // TODO: do it not throws currentParkingId
        this.newParking.id = payload.opinion.parking;
        this.updateParking(this.newParking);
        this.newParking = {};
        this.emit("change");
        this.emit("saveNewParkingSuccess");
    },





    getParking: function (id) {
        return _.find(this.parkingList, function(parking) {
            return parking.id == id
        }.bind(this))
    },

    /**
     * update parking data in list or add new
     * @param newParking
     */
    updateParking: function (newParking) {
        var updated = false;
        _.map(this.parkingList, function(parking, i) {
            if(parking.id == newParking.id){
                this.parkingList[i] = newParking;
                updated = true;
            }
        }.bind(this));

        if (!updated) {
            this.parkingList.push(newParking)
        }
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