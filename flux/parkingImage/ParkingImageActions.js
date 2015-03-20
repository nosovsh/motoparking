var ParkingImageConstants = require("./ParkingImageConstants");
var ParkingImageClient = require("./ParkingImageClient");
var _ = require("lodash");

var ParkingImageActions = {
    loadParkingImageList: function (parkingId) {
        this.dispatch(ParkingImageConstants.LOAD_PARKING_IMAGE_LIST, {parkingId: parkingId});

        ParkingImageClient.loadParkingImages(parkingId, function (parkingImages) {
            this.dispatch(ParkingImageConstants.LOAD_PARKING_IMAGE_LIST_SUCCESS, {parkingId: parkingId, parkingImages: parkingImages})
        }.bind(this), function (error) {
            this.dispatch(ParkingImageConstants.LOAD_PARKING_IMAGE_LIST_FAIL, {error: error});
        })
    },
    postParkingImage: function (parkingImage) {
        parkingImage = _.merge({}, parkingImage);
        parkingImage.status = 'SAVING';
        parkingImage.tempId = _.uniqueId("parkingImage_");
        this.dispatch(ParkingImageConstants.POST_PARKING_IMAGE, {parkingImage: parkingImage});

        ParkingImageClient.postParkingImage(parkingImage, function (parkingImage) {
            this.dispatch(ParkingImageConstants.POST_PARKING_IMAGE_SUCCESS, {parkingImage: parkingImage})
        }.bind(this), function (error) {
            this.dispatch(ParkingImageConstants.POST_PARKING_IMAGE_FAIL, {parkingImage: parkingImage, error: error});
        })
    }
};

module.exports = ParkingImageActions;