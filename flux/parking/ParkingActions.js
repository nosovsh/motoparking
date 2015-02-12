var ParkingConstants = require("./ParkingConstants");
var ParkingClient = require("./ParkingClient");
var OpinionConstants = require("../opinion/OpinionConstants");
var OpinionClient = require("../opinion/OpinionClient");

var ParkingActions = {
  loadCurrentParking: function(parkingId) {
    setTimeout(function(){this.dispatch(ParkingConstants.LOAD_CURRENT_PARKING, {parkingId: parkingId})}.bind(this), 0);

    ParkingClient.loadParking(parkingId, function (parking){
      this.dispatch(ParkingConstants.LOAD_CURRENT_PARKING_SUCCESS, {parking: parking})
    }.bind(this), function(error) {
      this.dispatch(ParkingConstants.LOAD_CURRENT_PARKING_FAIL, {error: error});
    })
  },

  unselectCurrentParking: function () {
        this.dispatch(ParkingConstants.UNSELECT_CURRENT_PARKING, {});
  },

  loadParkingList: function() {
    this.dispatch(ParkingConstants.LOAD_PARKING_LIST, {});

    ParkingClient.loadParkingList({}, function (parkingList){
      this.dispatch(ParkingConstants.LOAD_PARKING_LIST_SUCCESS, {parkingList: parkingList})
    }.bind(this), function(error) {
      this.dispatch(ParkingConstants.LOAD_PARKING_LIST_FAIL, {error: error});
    })
  },

  editLocation: function () {
    this.dispatch(ParkingConstants.EDIT_LOCATION, {});
  },

  editLocationDone: function (opinion) {
    /* TODO:
    1. действия над Opininon в  ParkingActions
    2. передается целый opinion, а надо только координаты
    3. Почти такой же код, как при просто сохранении Opinion*/
    this.dispatch(ParkingConstants.EDIT_LOCATION_DONE, {});

    opinion = _.merge({}, opinion);
    opinion.status = 'SAVING';
    this.dispatch(OpinionConstants.POST_LOCATION, {opinion: opinion});

    OpinionClient.postOpinion(opinion, function (opinion) {
      this.dispatch(OpinionConstants.POST_LOCATION_SUCCESS, {opinion: opinion})
    }.bind(this), function(error) {
      this.dispatch(OpinionConstants.POST_LOCATION_FAIL, {opinion: opinion, error: error});
    })
  },

  editLocationCancel: function () {
    this.dispatch(ParkingConstants.EDIT_LOCATION_CANCEL, {});
  },

  changeCurrentParkingTemporaryPosition: function (latLng) {
    this.dispatch(ParkingConstants.CHANGE_CURRENT_PARKING_TEMPORARY_POSITION, {latLng: latLng});
  },

  newParkingEditLocation: function () {
    this.dispatch(ParkingConstants.NEW_PARKING_EDIT_LOCATION, {});
  },

  newParkingEditLocationCancel: function () {
    this.dispatch(ParkingConstants.NEW_PARKING_EDIT_LOCATION_CANCEL, {});
  },

  newParkingEditInfo: function () {
    this.dispatch(ParkingConstants.NEW_PARKING_EDIT_INFO, {});
  },

  onNewParkingEditInfoCancel: function () {
    this.dispatch(ParkingConstants.NEW_PARKING_EDIT_INFO_CANCEL, {});
  },

  newParkingUpdateData: function (data) {
    this.dispatch(ParkingConstants.NEW_PARKING_UPDATE_DATA, {data: data});
  },

  saveNewParking: function (opinion) {
    this.dispatch(ParkingConstants.SAVE_NEW_PARKING, {opinion: opinion});

    OpinionClient.postOpinion(opinion, function (opinion) {
      this.dispatch(ParkingConstants.SAVE_NEW_PARKING_SUCCESS, {opinion: opinion})
    }.bind(this), function(error) {
      this.dispatch(OpinionConstants.SAVE_NEW_PARKING_FAIL, {opinion: opinion, error: error});
    })
  }
};

module.exports = ParkingActions