var React = require("react/addons");
var $ = require("jquery");
var Carousel = require("nuka-carousel");

var Photo = require("../../Photo/Photo");
var FileUploader = require("./FileUploader/FileUploader");
var FileUploaderFake = require("./FileUploader/FileUploaderFake");
var decorators = require("./decorators");

require("./SliderWithFileUploader.css");


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

  getInitialState: function() {
    return {
      fakeSlider: true
    };
  },

  componentDidMount: function() {
    // enable gallery in some time because of strange bug in sidebar animation
    setTimeout(function() {
      this.setState({fakeSlider: false});
    }.bind(this), 200);
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

      if (this.state.fakeSlider) {
        return (
          slides[0]
        );
      }
      return (
        <Carousel decorators={ decorators }>
          { slides }
        </Carousel>
      );
    }
    return addImage;
  }
});

module.exports = SliderWithFileUploader;
