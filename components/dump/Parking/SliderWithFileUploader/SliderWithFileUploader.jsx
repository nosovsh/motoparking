var React = require("react/addons");
var $ = require("jquery");
var SliderSlick = require("react-slick");

var Photo = require("../../Photo/Photo");
var FileUploader = require("./FileUploader/FileUploader");
var FileUploaderFake = require("./FileUploader/FileUploaderFake");

require("./SliderWithFileUploader.css");
require("slick-carousel/slick/slick.css");


var SliderWithFileUploader = React.createClass({
  propTypes: {
    parkingImages: React.PropTypes.array,
    onSlideParkingImage: React.PropTypes.func,
    onAuthorizationRequired: React.PropTypes.func,
    currentUserIsAuthorized: React.PropTypes.bool,
    onPostParkingImage: React.PropTypes.func.isRequired,
    currentParkingId: React.PropTypes.string,
    cloudinaryConfig: React.PropTypes.object.isRequired
  },

  onAfterChange: function(index) {
    this.props.onSlideParkingImage(index === this.props.parkingImages.length ? "new" : index);
  },

  render: function() {
    var addImage = (
      <div key="add-image">
        { this.props.currentUserIsAuthorized ? (
          <FileUploader
            onPostParkingImage={ this.props.onPostParkingImage }
            currentParkingId={ this.props.currentParkingId }
            cloudinaryConfig={ this.props.cloudinaryConfig }/>
        ) : <FileUploaderFake onAuthorizationRequired={ this.props.onAuthorizationRequired }/> }
      </div>
    );
    if (this.props.parkingImages.length) {
      var slides = this.props.parkingImages.map(function(image) {
        var url = $.cloudinary.url(image.cloudinaryId, {width: 664, crop: "fill"});
        return (
          <div key={ image.tempId || image.id }>
            <Photo url={ url }/>
          </div>
        );
      }).concat(addImage);

      return (
        <SliderSlick
          className="Slider"
          afterChange={ this.onAfterChange }
          infinite={ false }
          speed={ 500 }
          slidesToShow={ 1 }
          slidesToScroll={ 1 }
          arrows
          dots>
          { slides }
        </SliderSlick>
      );
    }
    return addImage;
  }
});

module.exports = SliderWithFileUploader;
