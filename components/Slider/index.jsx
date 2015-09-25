var React = require("react/addons");
var $ = require("jquery");
var SliderSlick = require("react-slick");

require("./style.css");
require("slick-carousel/slick/slick.css");

var Photo = require("../dump/Photo/Photo");
var FileUploader = require("../FileUploader");


var Slider = React.createClass({
  propTypes: {
    parkingImages: React.PropTypes.array,
    onSlideParkingImage: React.PropTypes.func
  },

  onAfterChange: function(index) {
    this.props.onSlideParkingImage(index === this.props.parkingImages.length ? "new" : index);
  },

  render: function() {
    var addImage = (
      <div key="add-image">
        <FileUploader/>
      </div>
    );
    if (this.props.parkingImages.length) {
      var settings = {
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        dots: true
      };

      var slides = this.props.parkingImages.map(function(image) {
        var url = $.cloudinary.url(image.cloudinaryId, {width: 664, crop: "fill"});
        return (
          <div key={ image.tempId || image.id }>
            <Photo url={ url }/>
          </div>
        );
      });

      slides.push(addImage);

      return (
        <SliderSlick {...settings} className="Slider" afterChange={ this.onAfterChange }>
          { slides }
        </SliderSlick>
      );
    }
    return addImage;
  }
});

module.exports = Slider;
