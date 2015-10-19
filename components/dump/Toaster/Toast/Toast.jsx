var React = require("react");

require("./Toast.css");


var Toast = React.createClass({
  propTypes: {
    toast: React.PropTypes.object.isRequired
  },

  render: function() {
    var messageRows = this.props.toast.message.split("\n").map(function(str, i) {
      return (
        <p key={ i }>{ str }</p>
      );
    });
    return <div className="Toast"> { messageRows } </div>;
  }
});

module.exports = Toast;
