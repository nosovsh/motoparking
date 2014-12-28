var ParkingConstants = require("./ParkingConstants");
var ParkingClient = require("./ParkingClient");

var ParkingActions = {
  loadCurrentParking: function(parkingId) {
    this.dispatch(ParkingConstants.LOAD_CURRENT_PARKING, {parkingId: parkingId});

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
  }
};

module.exports = ParkingActions