var React = require("react/addons"),
    ProgressBar = require("progressbar.js"),
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

    mixins: [FluxMixin, StoreWatchMixin("ParkingStore", "CurrentUserStore")],

    propTypes: {},

    getDefaultProps: function () {
        return {};
    },

    getInitialState: function () {
        return {
            uploading: false
        }
    },

    render: function () {
        var addImageStyle = {},
            progressBarStyle = {};
        if (this.state.uploading)
            addImageStyle["display"] = "none";
        else
            progressBarStyle["display"] = "none";
        return (
            <div className="FileUploader">
                <label className="FileUploader__label" style={ addImageStyle } onClick={ this.onFileUploaderClick }>
                    <Icon name="add-image" />
                    { this.state.isAuthorized ? <input type="file" ref="fileInput" name="file"/> : null }
                </label>
                <div className="Progressbar" ref="progressbar" style={progressBarStyle}></div>
                <div className="FileUploader__CancelWrapper" style={progressBarStyle}>
                    <Icon name="close" onClick={ this.onCancelUpload } />
                </div>
            </div>
        )
    },
    onFileUploaderClick: function () {
        if (!this.state.isAuthorized) {
            this.getFlux().actions.authorizationRequired()
        }
    },
    componentDidMount: function () {
        if (this.state.isAuthorized) {
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
            ).bind('fileuploadstart', function (e, data) {
                    console.log("fileuploadstart");
                    this.setState({
                        uploading: true
                    });
                }.bind(this)
            ).bind('cloudinarydone', function (e, data) {
                    console.log("cloudinarydone");
                    this.setState({
                        uploading: false
                    });
                    this.getFlux().actions.postParkingImage({
                        "cloudinaryId": data.result.public_id,
                        "parking": this.state.currentParkingId
                    });
                }.bind(this)
            ).bind('cloudinaryprogress', function (e, data) {
                    var loaded = data.loaded / data.total;
                    console.log(loaded);
                    console.log(data);
                    //this.getFlux().actions.showParkingImageUploadProgress(loaded);
                    this.circle.animate(loaded)
                }.bind(this)
            ).bind('fileuploadadd', function (e, data) {
                    this.jqXHR = data.submit(); // Catching the upload process of every file
                }.bind(this));


            var circleNode = this.refs.progressbar.getDOMNode();

            this.circle = new ProgressBar.Circle(circleNode, {
                color: '#979797',
                strokeWidth: 1
            });
        }
    },

    componentWillUnmount: function () {
        if (this.state.isAuthorized) {
            var fileInput = this.refs.fileInput.getDOMNode();
            $(fileInput).fileupload('destroy');
            window.fileUploadCounter--;
        }
    },

    getStateFromFlux: function () {
        var store = this.getFlux().store("ParkingStore");
        var currentUserStore = this.getFlux().store("CurrentUserStore");

        return {
            error: store.error,
            currentParkingId: store.currentParkingId,
            isAuthorized: currentUserStore.isAuthorized()
        };
    },

    onCancelUpload: function (e) {
        if (this.jqXHR) {
            this.jqXHR.abort();
            this.jqXHR = null;
        }
        this.setState({
            uploading: false
        });
        this.circle.animate(0);
        console.log("Upload canceled");

    }

});

module.exports = FileUploader;
