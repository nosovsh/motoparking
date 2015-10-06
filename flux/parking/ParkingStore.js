var Fluxxor = require("fluxxor");
var ParkingConstants = require("./ParkingConstants");
var OpinionConstants = require("../opinion/OpinionConstants");
var _ = require("lodash");
var analytics = require("../../utils/analytics");


var ParkingStore = Fluxxor.createStore({
  initialize: function() {
    this.loading = false;
    this.error = null;
    this.parkingList = [];
    this.currentParkingId = null;
    this.editingLocation = false;
    this.currentParkingTemporaryPosition = null;
    this.newParkingEditingLocation = false;
    this.newParkingEditInfo = false;
    this.newParking = {};
    this.loadingAddress = false;
    this.loadingAddressError = null;

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

      OpinionConstants.POST_LOCATION_SUCCESS, this.onPostLocationSuccess,

      OpinionConstants.EDIT_OPINION, this.onEditOpinion,
      OpinionConstants.POST_OPINION, this.onPostOpinion,
      OpinionConstants.POST_OPINION_SUCCESS, this.onPostOpinionSuccess,

      ParkingConstants.CHANGE_CURRENT_PARKING_TEMPORARY_POSITION, this.onChangeCurrentParkingTemporaryPosition,

      ParkingConstants.NEW_PARKING, this.onNewParking,

      ParkingConstants.NEW_PARKING_UPDATE_DATA, this.onNewParkingUpdateData,
      ParkingConstants.SAVE_NEW_PARKING, this.onSaveNewParking,
      ParkingConstants.SAVE_NEW_PARKING_SUCCESS, this.onSaveNewParkingSuccess,
      ParkingConstants.SAVE_NEW_PARKING_FAIL, this.onSaveNewParkingFail,

      ParkingConstants.PARKING_SCROLLED, this.onParkingScrolled,

      ParkingConstants.LOAD_ADDRESS, this.onLoadAddress,
      ParkingConstants.LOAD_ADDRESS_SUCCESS, this.onLoadAddressSuccess,
      ParkingConstants.LOAD_ADDRESS_FAIL, this.onLoadAddressFail
    );
  },

  onLoadCurrentParking: function(payload) {
    this.loading = true;
    this.currentParkingId = payload.parkingId;
    this.editingLocation = false;
    this.emit("change");
    this.emit("loadCurrentParking");
  },

  onLoadCurrentParkingSuccess: function(payload) {
    var parking = _.extend({}, payload.parking, {isFullParkingLoaded: true});
    this.updateParking(parking);
    if (payload.parking.id === this.currentParkingId) {
      this.loading = false;
      this.error = null;
      if (!parking.address && this.flux.stores.CurrentUserStore.isAuthorized()) {
        setTimeout(function() {
          this.flux.actions.loadAddress(parking);
        }.bind(this), 0);
      }
    }
    this.emit("change");
    this.emit("loadCurrentParkingSuccess");
  },

  onLoadCurrentParkingFail: function(payload) {
    this.loading = false;
    this.error = payload.error;
    this.emit("change");
  },

  onLoadAddress: function(payload) { // eslint-disable-line no-unused-vars
    this.loadingAddress = true;
    this.emit("change");
  },

  onLoadAddressSuccess: function(payload) {
    var parking = _.extend({}, this.getParking(payload.parking.id), {address: payload.address});
    this.updateParking(parking);
    setTimeout(function() {
      var opinion = _.extend({}, parking.myOpinion, {parking: payload.parking.id}, {address: payload.address});
      this.flux.actions.postOpinion(opinion);
    }.bind(this), 0);
    if (payload.parking.id === this.currentParkingId) {
      this.loadingAddress = false;
      this.loadingAddressError = null;
    }
    this.emit("change");
  },

  onLoadAddressFail: function(payload) {
    this.loading = false;
    this.loadingAddressError = payload.error;
    this.emit("change");
  },

  onUnselectCurrentParking: function() {
    this.currentParkingId = null;
    this.emit("change");
    this.emit("unselectCurrentParking");
  },

  onLoadParkingList: function(payload) { // eslint-disable-line no-unused-vars
    this.loading = true;
    this.emit("change");
  },

  onLoadParkingListSuccess: function(payload) {
    this.loading = false;
    this.error = null;

    // do not update parking of it is already loaded. Quite straightforward method.
    // Should be rewriten
    var alreadyLoadedParkingIds = _.pluck(this.parkingList, "id");
    var newParkings = _.filter(payload.parkingList, function(newParking) {
      return !_.find(alreadyLoadedParkingIds, function(id) {
        return id === newParking.id;
      });
    });
    this.parkingList = this.parkingList.concat(newParkings);
    this.emit("change");
    this.emit("loadParkingListSuccess");
  },

  onLoadParkingListFail: function(payload) {
    this.loading = false;
    this.error = payload.error;
    this.emit("change");
  },

  onEditOpinion: function(payload) { // eslint-disable-line no-unused-vars
    analytics.event("Opinion", "editing");
  },

  onPostOpinion: function(payload) {
    var parking = this.getParking(payload.opinion.parking);
    var newParking = _.merge(parking, {myOpinion: payload.opinion});
    this.updateParking(newParking);
    this.emit("change");
  },

  onPostOpinionSuccess: function(payload) {
    setTimeout(function() {
      this.flux.actions.loadCurrentParking(payload.opinion.parking);
    }.bind(this), 0);
    analytics.event("Opinion", "created");
    this.emit("change");
  },

  onEditLocation: function() {
    this.editingLocation = true;
    analytics.event("Location", "editing");
    this.emit("change");
    this.emit("editLocation");
  },

  onEditLocationDone: function(payload) {
    this.editingLocation = false;
    var parking = this.getParking(payload.opinion.parking);
    parking.latLng = payload.opinion.latLng;
    this.currentParkingTemporaryPosition = null;
    this.updateParking(parking);
    analytics.event("Location", "edited");
    this.emit("change");
    this.emit("editLocationDone");
  },

  onEditLocationCancel: function() {
    this.editingLocation = false;
    this.currentParkingTemporaryPosition = null;
    analytics.event("Location", "canceled");
    this.emit("change");
    this.emit("editLocationCancel");
  },

  onPostLocationSuccess: function(payload) {
    setTimeout(function() {
      this.flux.actions.loadCurrentParking(payload.opinion.parking);
    }.bind(this), 0);
  },

  onChangeCurrentParkingTemporaryPosition: function(payload) {
    this.currentParkingTemporaryPosition = payload.latLng;
    this.emit("change");
  },

  onNewParking: function(payload) { // eslint-disable-line no-unused-vars
    this.savingNewParking = false;
    this.newParkingEditInfo = false;
    this.newParkingEditingLocation = true;
    this.newParking = {};
    this.emit("change");
    this.emit("newParking");
  },

  onNewParkingUpdateData: function(payload) {
    this.newParking = _.extend({}, this.newParking, payload.data);
    this.emit("change");
  },

  onSaveNewParking: function(payload) { // eslint-disable-line no-unused-vars
    this.savingNewParking = true;
    this.emit("change");
  },

  onSaveNewParkingSuccess: function(payload) {
    this.savingNewParking = false;
    this.newParkingEditInfo = false;
    this.currentParkingId = payload.opinion.parking; // TODO: do it not throws currentParkingId
    this.newParking.id = payload.opinion.parking;
    this.updateParking(_.extend({}, this.newParking, {
      "isMoto": payload.opinion.isMoto,
      "isSecure": payload.opinion.isSecure
    }));
    this.newParking = {};
    analytics.event("Parking", "created");
    setTimeout(function() {
      this.flux.actions.successToast("Парковка создана! Спасибо, этот мир стал чуточку лучше. \n Если есть желание, можно добавить фотографию или пару слов в комментариях.");
    }, 0);
    this.emit("change");
    this.emit("saveNewParkingSuccess");
  },

  onSaveNewParkingFail: function(payload) { // eslint-disable-line no-unused-vars
    this.savingNewParking = false;
    this.emit("change");
  },

  onParkingScrolled: function(payload) {
    analytics.event("Parking", "scrolled_" + payload.position);
  },


  getParking: function(id) {
    return _.find(this.parkingList, function(parking) {
      return parking.id === id;
    });
  },

  getParkings: function(parkingIds) {
    return _.filter(this.parkingList, function(parking) {
      return parkingIds.indexOf(parking.id) !== -1;
    });
  },

  /**
   * update parking data in list or add new
   * @param newParking
   */
  updateParking: function(newParking) {
    var updated = false;
    _.map(this.parkingList, function(parking, i) {
      if (parking.id === newParking.id) {
        this.parkingList[i] = newParking;
        updated = true;
      }
    }.bind(this));

    if (!updated) {
      this.parkingList.push(newParking);
    }
  },

  getCurrentParking: function() {
    return this.getParking(this.currentParkingId) || {};
  },

  getMyOpinionOfCurrentParking: function() {
    var myOpinion = this.getCurrentParking().myOpinion || {};
    myOpinion = _.extend({}, myOpinion, {"parking": this.getCurrentParking().id}); // always fill with parking id
    return myOpinion;
  }
});

module.exports = ParkingStore;
