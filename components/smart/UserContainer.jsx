var React = require("react/addons");
var Fluxxor = require("fluxxor");

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var User = require("../dump/User/User");


var UserContainer = React.createClass({
  propTypes: {
    params: React.PropTypes.object
  },

  mixins: [FluxMixin, StoreWatchMixin("UserStore")],

  componentDidMount: function() {
    this.getFlux().actions.loadUser(this.props.params.userId);
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.params.userId !== this.props.params.userId) {
      this.getFlux().actions.loadUser(nextProps.params.userId);
    }
  },

  getStateFromFlux: function() {
    var userStore = this.getFlux().store("UserStore");

    return {
      user: userStore.users[this.props.params.userId]
    };
  },

  render: function() {
    return <User user={ this.state.user }/>;
  }
});

module.exports = UserContainer;
