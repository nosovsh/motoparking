var React = require("react/addons"),
    Fluxxor = require("fluxxor"),
    $ = require("jquery"),
    SliderSlick = require('react-slick');

require("./style.css");
require("slick-carousel/slick/slick.css");

var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Photo = require("../dump/Photo/Photo"),
    FileUploader = require("../FileUploader");


var Slider = React.createClass({

    mixins: [FluxMixin, StoreWatchMixin("ParkingStore", "ParkingImageStore")],

    propTypes: {},

    getDefaultProps: function () {
        return {};
    },

    render: function () {
        var addImage = (
            <div key="add-image">
                <FileUploader/>
            </div>
        );
        if (this.state.parkingImages.length) {
            var settings = {
                infinite: false,
                speed: 500,
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: true,
                dots: true
            };

            var slides = this.state.parkingImages.map(function (image) {
                var url = $.cloudinary.url(image.cloudinaryId, {width: 664, crop: 'fill'});
                return (
                    <div key={ image.tempId || image.id }>
                        <Photo url={ url }/>
                    </div>
                )
            }.bind(this));
            slides.push(addImage);
            return (
                <SliderSlick {...settings} className="Slider" afterChange={ this.onAfterChange }>
                    { slides }
                </SliderSlick>
            )
        } else {
            return addImage;
        }
    },

    getStateFromFlux: function () {
        var store = this.getFlux().store("ParkingStore");
        var parkingImageStore = this.getFlux().store("ParkingImageStore");

        return {
            loading: store.loading,
            error: store.error,
            currentParkingId: store.currentParkingId,
            parkingImages: parkingImageStore.getParkingImages(store.currentParkingId)
        };
    },

    onAfterChange: function (index) {
        if (index == this.state.parkingImages.length)
            index = "new";
        this.getFlux().actions.slideParkingImage(index)
    }

});

module.exports = Slider;
