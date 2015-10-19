var React = require("react");
var Icon = require("../../../Icon/Icon");


var FileUploaderFake = React.createClass({
  propTypes: {
    onAuthorizationRequired: React.PropTypes.func.isRequired
  },
  render: function() {
    return (
      <div className="FileUploader">
        <label className="FileUploader__label" onClick={ this.props.onAuthorizationRequired }>
          <Icon name="add-image" isExpandOnHover/>
        </label>
      </div>
    );
  }
});

module.exports = FileUploaderFake;
