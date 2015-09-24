var React = require("react/addons");
var TimeoutTransitionGroup = require("react-components/js/timeout-transition-group");

var Toast = require("./Toast/Toast");

require("./Toaster.css");


var Toaster = React.createClass({
  propTypes: {
    toasts: React.PropTypes.array
  },

  getDefaultProps: function() {
    return {
      toasts: []
    };
  },

  render: function() {
    var toastsComponents = this.props.toasts.map(function(toast) {
      return (
        <Toast toast={ toast } key={ toast.id }/>
      );
    });
    return (
      <div className="Toaster">
        <TimeoutTransitionGroup
          enterTimeout={1000}
          leaveTimeout={1000}
          transitionName="Toast">
            { toastsComponents }
        </TimeoutTransitionGroup>
      </div>
    );
  }
});

module.exports = Toaster;
