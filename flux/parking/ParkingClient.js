/* global YANDEX_API_KEY */
var _ = require("lodash");
var $ = require("jquery");

var ParkingClient = {
  loadParking: function(parkingId, success, failure) {
    $.ajax({
      dataType: "json",
      url: "/api/parkings/" + parkingId + "/",
      data: {},
      success: success,
      error: failure
    });
  },

  loadParkingList: function(params, success, failure) {
    var moreParams = _.extend({}, params, {"_limit": 10000});
    $.ajax({
      dataType: "json",
      url: "/api/parkings/",
      data: moreParams,
      success: function(ret) {
        success(ret.data);
      },
      error: failure
    });
  },

  loadAddress: function(latLng, success, failure) {
    $.ajax({
      dataType: "json",
      url: "http://geocode-maps.yandex.ru/1.x/",
      data: {
        geocode: latLng.coordinates[1] + "," + latLng.coordinates[0],
        format: "json",
        key: YANDEX_API_KEY
      },
      success: function(ret) {
        console.log("Address from Yandex:", ret);
        success(ret.response.GeoObjectCollection.featureMember[0].GeoObject.name);
      },
      error: failure
    });
  },

  deleteParking: function(parkingId, success, failure) {
    $.ajax({
      dataType: "json",
      url: "/api/parkings/" + parkingId + "/",
      data: {},
      success: success,
      error: failure,
      method: "DELETE"
    });
  }
};

module.exports = ParkingClient;
