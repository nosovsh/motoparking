var React = require("react/addons");

require("./style.css");


var Photo = React.createClass({
  propTypes: {
    url: React.PropTypes.string.isRequired
  },

  render: function() {
    var style = {
      "backgroundImage": "url('" + this.props.url + "')"
    };
    return (
      <div style={ style } className="Photo" />
    );
  }
});

module.exports = Photo;
