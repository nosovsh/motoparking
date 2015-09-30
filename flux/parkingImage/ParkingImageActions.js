var ParkingImageConstants = require("./ParkingImageConstants");
var ParkingImageClient = require("./ParkingImageClient");
var _ = require("lodash");

var ParkingImageActions = {
  loadParkingImageList: function(parkingId) {
    this.dispatch(ParkingImageConstants.LOAD_PARKING_IMAGE_LIST, {parkingId: parkingId});

    ParkingImageClient.loadParkingImages(parkingId, function(parkingImages) {
      this.dispatch(ParkingImageConstants.LOAD_PARKING_IMAGE_LIST_SUCCESS, {
        parkingId: parkingId,
        parkingImages: parkingImages
      });
    }.bind(this), function(error) {
      this.dispatch(ParkingImageConstants.LOAD_PARKING_IMAGE_LIST_FAIL, {error: error});
    }.bind(this));
  },

  postParkingImage: function(parkingImage) {
    // TODO: move statuses to constants
    var newParkingImage = _.merge({}, parkingImage);
    newParkingImage.status = "SAVING";
    newParkingImage.tempId = _.uniqueId("parkingImage_");
    this.dispatch(ParkingImageConstants.POST_PARKING_IMAGE, {parkingImage: newParkingImage});

    ParkingImageClient.postParkingImage(newParkingImage, function(returnedParkingImage) {
      this.dispatch(ParkingImageConstants.POST_PARKING_IMAGE_SUCCESS, {parkingImage: returnedParkingImage});
    }.bind(this), function(error) {
      this.dispatch(ParkingImageConstants.POST_PARKING_IMAGE_FAIL, {parkingImage: newParkingImage, error: error});
    });
  },

  slideParkingImage: function(index) {
    this.dispatch(ParkingImageConstants.SLIDE_PARKING_IMAGE, {index: index});
  }
};

module.exports = ParkingImageActions;
