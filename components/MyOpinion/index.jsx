var React = require("react");

var MyOpinionExists = require("./MyOpinionExists");
var MyOpinionNotExists = require("./MyOpinionNotExists");

require("./style.css");


var MyOpinion = React.createClass({
  propTypes: {
    parking: React.PropTypes.object.isRequired,
    currentUserIsAuthorized: React.PropTypes.bool,
    actions: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      wantToChangeOpinion: false
    };
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.parking.id !== this.props.parking.id) {
      this.onWantToChangeOpinion(false);
    }
  },

  onWantToChangeOpinion: function(value) {
    if (value) {
      this.props.actions.editOpinion();
    }
    this.setState({wantToChangeOpinion: value});
  },

  render: function() {
    return (
      <div className="my-opinion">
        { this.props.parking.myOpinion && this.props.parking.myOpinion.isSecure && !this.state.wantToChangeOpinion ? (
          <MyOpinionExists
            parking={ this.props.parking }
            onWantToChangeOpinion={ this.onWantToChangeOpinion }/>
        ) : (
          <MyOpinionNotExists
            parking={ this.props.parking }
            onWantToChangeOpinion={ this.onWantToChangeOpinion }
            currentUserIsAuthorized={ this.props.currentUserIsAuthorized }
            actions={ this.props.actions }/>
        ) }
      </div>
    );
  }
});

module.exports = MyOpinion;
