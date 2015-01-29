var _ = require("lodash"),
    Faker = require("Faker"),
    $ = require("jquery");

var ParkingClient = {
  loadParking: function(parkingId, success, failure) {
    $.ajax({
      dataType: "json",
      url: "http://127.0.0.1:5000/api/parkings/" + parkingId,
      data: {},
      success: success
    });
  },

  loadParkingList: function(params, success, failure) {
    $.ajax({
      dataType: "json",
      url: "http://127.0.0.1:5000/api/parkings/",
      data: params,
      success: function(ret){success(ret['data'])}
    });

  }
};

module.exports = ParkingClient;