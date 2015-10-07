var React = require("react/addons");
var ProgressBar = require("progressbar.js");

var Icon = require("../../../Icon/Icon");

require("./style.css");
require("imports?define=>false!blueimp-file-upload/js/jquery.fileupload");
require("./jquery.cloudinary");
var $ = require("jquery");
// TODO: move to config
$.cloudinary.config({cloud_name: "motoparking", api_key: "666287416361873"});


var FileUploader = React.createClass({
  propTypes: {
    currentParkingId: React.PropTypes.string.isRequired,
    onPostParkingImage: React.PropTypes.func.isRequired,
    cloudinaryConfig: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      uploading: false
    };
  },

  componentDidMount: function() {
    // TODO: add error handling
    var options = {};

    var fileInput = this.refs.fileInput.getDOMNode();
    $(fileInput).unsigned_cloudinary_upload(
      this.props.cloudinaryConfig.uploadPreset,
      this.props.cloudinaryConfig.uploadParams,
      options
    ).bind("fileuploadstart", function(e, data) { // eslint-disable-line no-unused-vars
      console.log("fileuploadstart");
      this.setState({
        uploading: true
      });

      var circleNode = this.refs.progressbar.getDOMNode();
      this.circle = new ProgressBar.Circle(circleNode, {
        color: "#979797",
        strokeWidth: 1
      });
    }.bind(this)).bind("cloudinarydone", function(e, data) {
      console.log("cloudinarydone");
      this.setState({
        uploading: false
      });
      this.props.onPostParkingImage({
        "cloudinaryId": data.result.public_id,
        "parking": this.props.currentParkingId
      });
    }.bind(this)).bind("cloudinaryprogress", function(e, data) {
      var loaded = data.loaded / data.total;
      this.circle.animate(loaded);
    }.bind(this)).bind("fileuploadadd", function(e, data) {
      this.jqXHR = data.submit(); // Catching the upload process of every file
    }.bind(this));
  },

  onCancelUpload: function(e) { // eslint-disable-line no-unused-vars
    if (this.jqXHR) {
      this.jqXHR.abort();
      this.jqXHR = null;
    }
    this.setState({
      uploading: false
    });
    this.circle.animate(0);
    console.log("Upload canceled");
  },

  render: function() {
    return (
      <div className="FileUploader">
        { this.state.uploading ? (
            <div className="Progressbar" ref="progressbar"></div>
        ) : null }
        { this.state.uploading ? (
          <div className="FileUploader__CancelWrapper">
              <Icon name="close" onClick={ this.onCancelUpload } />
          </div>
        ) : null }
        { !this.state.uploading ? (
          <label className="FileUploader__label">
            <Icon name="add-image" isExpandOnHover/>
            <input type="file" ref="fileInput" name="file"/>
          </label>
        ) : null }
      </div>
    );
  }
});

module.exports = FileUploader;
