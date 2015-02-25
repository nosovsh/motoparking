var _ = require("lodash"),
    $ = require("jquery");

var ParkingClient = {
  loadParking: function(parkingId, success, failure) {
    setTimeout(function () {
      $.ajax({
        dataType: "json",
        url: "http://127.0.0.1:5000/api/parkings/" + parkingId,
        data: {},
        success: success
      })
    }, 1000);
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