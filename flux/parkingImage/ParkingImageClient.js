var _ = require("lodash"),
    $ = require("jquery");

var ParkingImageClient = {
    loadParkingImages: function (parkingId, success, failure) {
        setTimeout(function () {
            $.ajax({
                dataType: "json",
                url: "/api/parking_images/" + parkingId,
                data: {"parking": parkingId},
                success: success
            })
        }, 0);
    },

    postParkingImage: function (parkingImage, success, failure) {
        $.ajax({
            type: "POST",
            //dataType: "json",
            contentType: "application/json",
            url: "/api/parking_images/",
            data: JSON.stringify(parkingImage),
            success: function (ret) {
                success(ret)
            }
        });
    }
};

module.exports = ParkingImageClient;