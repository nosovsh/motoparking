var React = require("react/addons");
var Icon = require("../dump/Icon/Icon");


var FileUploaderFake = React.createClass({
  propTypes: {
    onAuthorizationRequired: React.PropTypes.func.isRequired
  },
  render: function() {
    return (
      <div className="FileUploader">
        <label className="FileUploader__label" onClick={ this.props.onAuthorizationRequired }>
          <Icon name="add-image" />
        </label>
      </div>
    );
  }
});

module.exports = FileUploaderFake;
