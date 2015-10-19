var React = require("react");
var Fluxxor = require("fluxxor");

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var User = require("../dump/User/User");


var UserContainer = React.createClass({
  propTypes: {
    params: React.PropTypes.object
  },

  mixins: [FluxMixin, StoreWatchMixin("UserStore", "OpinionStore", "ParkingStore")],

  componentDidMount: function() {
    // delaying load a little bit so that animation be smooth
    setTimeout(function() {
      this.getFlux().actions.loadUser(this.props.params.userId);
    }.bind(this), 200);
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.params.userId !== this.props.params.userId) {
      this.getFlux().actions.loadUser(nextProps.params.userId);
    }
  },

  getStateFromFlux: function() {
    var userStore = this.getFlux().store("UserStore");
    var opinionStore = this.getFlux().store("OpinionStore");
    var parkingStore = this.getFlux().store("ParkingStore");

    var user = userStore.users[this.props.params.userId];
    var opinions = user && user.opinionIds && opinionStore.getOpinions(userStore.users[this.props.params.userId].opinionIds || []);
    var parkingsArray = parkingStore.getParkings(_.pluck(_.values(opinions), "parking")) || [];
    var parkings = _.zipObject(parkingsArray.map(function(parking) {
      return [parking.id, parking];
    }));

    return {
      user: user,
      opinions: opinions,
      parkings: parkings
    };
  },

  render: function() {
    return (
      <User
        user={ this.state.user }
        opinions={ this.state.opinions }
        parkings={ this.state.parkings }/>
    );
  }
});

module.exports = UserContainer;
