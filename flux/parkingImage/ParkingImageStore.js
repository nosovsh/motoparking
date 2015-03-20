var Fluxxor = require("fluxxor"),
    ParkingImageConstants = require("./ParkingImageConstants"),
    _ = require("lodash");

var ParkingImageStore = Fluxxor.createStore({
    initialize: function () {
        this.loading = false;
        this.error = null;
        this.parkingImagesByParking = {};

        this.bindActions(
            ParkingImageConstants.LOAD_PARKING_IMAGE_LIST, this.onLoadParkingImages,
            ParkingImageConstants.LOAD_PARKING_IMAGE_LIST_SUCCESS, this.onLoadParkingImagesSuccess,
            ParkingImageConstants.LOAD_PARKING_IMAGE_LIST_FAIL, this.onLoadParkingImagesFail,

            ParkingImageConstants.POST_PARKING_IMAGE, this.onPostParkingImage,
            ParkingImageConstants.POST_PARKING_IMAGE_SUCCESS, this.onPostParkingImageSuccess,
            ParkingImageConstants.POST_PARKING_IMAGE_FAIL, this.onPostParkingImageFail
        );
    },

    onLoadParkingImages: function (payload) {
        this.loading = true;
        this.emit("change");
    },

    onLoadParkingImagesSuccess: function (payload) {
        this.parkingImagesByParking[payload.parkingId] = payload.parkingImages;
        this.loading = false;
        this.error = null;
        this.emit("change");
    },

    onLoadParkingImagesFail: function (payload) {
        this.loading = false;
        this.error = payload.error;
        this.emit("change");
    },

    onPostParkingImage: function (payload) {
        this.loading = true;
        var parkingImage = _.extend({}, payload.parkingImage);
        parkingImage.user = this.flux.store("CurrentUserStore").currentUser;
        this.parkingImagesByParking[parkingImage.parking] = this.parkingImagesByParking[parkingImage.parking] || [];
        this.parkingImagesByParking[parkingImage.parking].unshift(parkingImage);
        this.emit("change");
    },

    onPostParkingImageSuccess: function (payload) {
        _.each(this.parkingImagesByParking[payload.parkingImage.parking.id], function (parkingImage, i) {
            if (parkingImage.tempId == payload.parkingImage.tempId) {
                this.parkingImagesByParking[payload.parkingImage.parking.id][i] = payload.parkingImage;
            }
        }.bind(this));
        this.loading = false;
        this.error = null;
        this.emit("change");
    },

    onPostParkingImageFail: function (payload) {
        _.each(this.parkingImagesByParking[payload.parkingImage.parkingId], function (parkingImage) {
            if (parkingImage.tempId = payload.parkingImage.tempId) {
                parkingImage.status = 'FAIL';
            }
        });
        this.loading = false;
        this.error = payload.error;
        this.emit("change");
    },

    getParkingImages: function (parkingId) {
        return this.parkingImagesByParking[parkingId] || []
    }
});

module.exports = ParkingImageStore;