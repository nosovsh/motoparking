var $ = require("jquery");

var ParkingImageClient = {
  loadParkingImages: function(parkingId, success, failure) {
    $.ajax({
      dataType: "json",
      url: "/api/parking_images/" + parkingId,
      data: {"parking": parkingId},
      success: success,
      error: failure
    });
  },

  postParkingImage: function(parkingImage, success, failure) {
    $.ajax({
      type: "POST",
      // dataType: "json",
      contentType: "application/json",
      url: "/api/parking_images/",
      data: JSON.stringify(parkingImage),
      success: success,
      error: failure
    });
  }
};

module.exports = ParkingImageClient;
