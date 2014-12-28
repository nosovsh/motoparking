var _ = require("lodash"),
    Faker = require("Faker");

var ParkingClient = {
  loadParking: function(parkingId, success, failure) {
    setTimeout(function() {
      success({
        title: "Парковка " + parkingId
      });
    }, 1000);
  },

  loadParkingList: function(params, success, failure) {
    setTimeout(function() {
      success([{
          latLng: [55.7522200, 37.6155600],
          id: 1
        }, {
          latLng: [55.7622200, 37.6155600],
          id: 2
        }, {
          latLng: [55.7722200, 37.6155600],
          id: 3
      }
      ]);
    }, 1000);
  }
};

module.exports = ParkingClient;