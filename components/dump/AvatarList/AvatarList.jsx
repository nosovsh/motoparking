var React = require("react/addons");
var _ = require("lodash");

var Avatar = require("../Avatar/Avatar");
var Tooltip = require("rc-tooltip");

require("./AvatarList.css");
require("rc-tooltip/assets/bootstrap.css");

var DEFAULT_GAP = 20;
var HOVER_GAP = 40;

var AvatarList = React.createClass({
  propTypes: {
    users: React.PropTypes.array.isRequired
  },

  getInitialState: function() {
    return {
      gap: 0 // px between objects
    };
  },

  componentDidMount: function() {
    setTimeout(function() {
      this.setState({gap: DEFAULT_GAP});
    }.bind(this), 0);
  },

  onMouseEnter: function() {
    this.setState({gap: HOVER_GAP});
  },

  onMouseLeave: function() {
    this.setState({gap: DEFAULT_GAP});
  },

  render: function() {
    var rightmostTransform = (this.state.gap / 2) * (this.props.users.length - 1); // position of the right element

    var avatarComponents = _.map(this.props.users, function(user, i) {
      var translateX = rightmostTransform - i * this.state.gap;
      var style = {
        "WebkitTransform": "translate(" + translateX + "px ,0)",
        "Transform": "translate(" + translateX + "px ,0)",
        "MsTransform": "translate(" + translateX + "px ,0)"
      };
      return (
        <div className="AvatarList__Object" style={ style } key={ user.id }>
          <Tooltip placement="bottom" trigger={["hover"]} overlay={<span>{ user.firstName } { user.lastName }</span>}>
            <Avatar user={ user } />
          </Tooltip>
        </div>
      );
    }.bind(this));
    return (
      <div className="AvatarList" onMouseEnter={ this.onMouseEnter } onMouseLeave={ this.onMouseLeave }>
        { avatarComponents }
      </div>
    );
  }
});

module.exports = AvatarList;
