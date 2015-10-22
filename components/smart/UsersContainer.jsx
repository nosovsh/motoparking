var React = require("react");
var Fluxxor = require("fluxxor");

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var config = require("../../config");

var Users = require("../dump/User/Users");


var ParkingContainer = React.createClass({
  propTypes: {
    params: React.PropTypes.object
  },

  mixins: [FluxMixin, StoreWatchMixin("UserStore")],

  componentDidMount: function() {
    // delaying load a little bit so that animation be smooth
    setTimeout(function() {
      this.getFlux().actions.loadUsers();
    }.bind(this), 600);
  },

  getStateFromFlux: function() {
    var userStore = this.getFlux().store("UserStore");

    return {
      usersIds: userStore.usersIds,
      users: userStore.users
    };
  },

  render: function() {
    return (
      <Users
        usersIds={ this.state.usersIds }
        users={ this.state.users }
      />
    );
  }
});

module.exports = ParkingContainer;
