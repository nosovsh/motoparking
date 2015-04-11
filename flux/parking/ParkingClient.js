var _ = require("lodash"),
    $ = require("jquery");

var ParkingClient = {
    loadParking: function (parkingId, success, failure) {
        setTimeout(function () {
            $.ajax({
                dataType: "json",
                url: "/api/parkings/" + parkingId,
                data: {},
                success: success
            })
        }, 0);
    },

    loadParkingList: function (params, success, failure) {
        $.ajax({
            dataType: "json",
            url: "/api/parkings/",
            data: params,
            success: function (ret) {
                success(ret['data'])
            }
        });

    },

    loadAddress: function (latLng, success, failure) {
        $.ajax({
            dataType: "json",
            url: "http://geocode-maps.yandex.ru/1.x/",
            data: {
                geocode: latLng.coordinates[1] + "," + latLng.coordinates[0],
                format: "json",
                key: YANDEX_API_KEY
            },
            success: function (ret) {
                console.log("Address from Yandex:", ret);
                success(ret.response.GeoObjectCollection.featureMember[0].GeoObject.name)
            }
        });


    }
};

module.exports = ParkingClient;