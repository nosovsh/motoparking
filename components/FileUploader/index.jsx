var React = require("react/addons"),
    Fluxxor = require("fluxxor");

var Icon = require("../Icon");

var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

require("./style.css");
require("imports?define=>false!blueimp-file-upload/js/jquery.fileupload");
require("./jquery.cloudinary");
$ = require("jquery");
$.cloudinary.config({cloud_name: 'motoparking', api_key: '666287416361873'});


var FileUploader = React.createClass({

    mixins: [FluxMixin, StoreWatchMixin("ParkingStore", "ParkingImageStore")],

    propTypes: {},

    getDefaultProps: function () {
        return {};
    },

    getInitialState: function () {
        return {}
    },

    render: function () {
        return (
            <div className="AddImage">
                <label>
                    <Icon name="add-image" />
                    <input type="file" ref="fileInput" name="file"/>
                </label>

            </div>
        )
    },

    componentDidMount: function () {
        // TODO: remove global object!
        var options = {};

        if (window.fileUploadCounter == undefined)
            window.fileUploadCounter = 0;

        if (window.fileUploadCounter != 0)
            options.dropZone = null;

        window.fileUploadCounter++;


        var fileInput = this.refs.fileInput.getDOMNode();
        $(fileInput).unsigned_cloudinary_upload("zpwu8wz2",
            {cloud_name: 'motoparking', tags: 'browser_uploads'},
            options
        ).bind('cloudinarydone', function (e, data) {
                console.log("cloudinarydone");
                this.getFlux().actions.postParkingImage({
                    "cloudinaryId": data.result.public_id,
                    "parking": this.state.currentParkingId
                });
            }.bind(this)
        ).bind('cloudinaryprogress', function (e, data) {

                $('.progress_bar').css('width',
                    Math.round((data.loaded * 100.0) / data.total) + '%');

            }.bind(this));
    },

    componentWillUnmount: function () {
        var fileInput = this.refs.fileInput.getDOMNode();

        $(fileInput).fileupload('destroy');
        window.fileUploadCounter--;

    },

    getStateFromFlux: function () {
        var store = this.getFlux().store("ParkingStore");
        var parkingImageStore = this.getFlux().store("ParkingImageStore");

        return {
            loading: store.loading,
            error: store.error,
            currentParkingId: store.currentParkingId
        };
    }

});

module.exports = FileUploader;
