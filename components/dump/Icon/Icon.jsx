var React = require("react/addons");
var classNames = require("classnames");

require("./Icon.css");


var Icon = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
    additionalClasses: React.PropTypes.array
  },

  render: function() {
    return (
      <i className={ classNames(["icon-" + this.props.name].concat(this.props.additionalClasses)) } {...this.props}/>
    );
  }
});

module.exports = Icon;
