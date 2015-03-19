var _ = require("lodash"),
    $ = require("jquery");

var ParkingClient = {
  loadParking: function(parkingId, success, failure) {
    setTimeout(function () {
      $.ajax({
        dataType: "json",
        url: "/api/parkings/" + parkingId,
        data: {},
        success: success
      })
    }, 0);
  },

  loadParkingList: function(params, success, failure) {
    $.ajax({
      dataType: "json",
      url: "/api/parkings/",
      data: params,
      success: function(ret){success(ret['data'])}
    });

  }
};

module.exports = ParkingClient;