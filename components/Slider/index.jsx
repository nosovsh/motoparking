var React = require("react/addons"),
    Fluxxor = require("fluxxor"),
    SliderSlick = require('react-slick');

require("./style.css");
require("slick-carousel/slick/slick.css");
require("slick-carousel/slick/slick-theme.css");

var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Photo = require("../Photo");


var Slider = React.createClass({

    mixins: [FluxMixin, StoreWatchMixin("ParkingImageStore")],

    propTypes: {
    },

    getDefaultProps: function () {
        return {
        };
    },

    render: function () {
        var settings = {
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: true
        };
        var slides = this.state.parkingImages.map(function (image) {
           return (
               <div key={ image.tempId || image.id }>
                   <Photo url={ image.url }/>
               </div>
           )
        });
        return (
            <SliderSlick {...settings} className="Slider">
                { slides }
            </SliderSlick>
        )
    },

    getStateFromFlux: function () {
        var store = this.getFlux().store("ParkingStore");
        var parkingImageStore = this.getFlux().store("ParkingImageStore");

        return {
            loading: store.loading,
            error: store.error,
            currentParkingId: store.currentParkingId,
            parkingImages: parkingImageStore.getParkingImages(store.currentParkingId),
        };
    }
});

module.exports = Slider;
