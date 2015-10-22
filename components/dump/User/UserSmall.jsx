var React = require("react");
var Router = require("react-router");
var Link = Router.Link;

var Avatar = require("../Avatar/Avatar");

require("./UserSmall.css");


var UserSmall = React.createClass({
  propTypes: {
    user: React.PropTypes.object
  },

  getDefaultProps: function() {
    return {
      user: {}
    };
  },

  render: function() {
    return (
      <Link to={ "/u/" + this.props.user.id}>
        <div className="UserSmall">
          <div className="UserSmall__AvatarWrapper">
            <Avatar user={ this.props.user }/>
          </div>
          <div className="UserSmall__Data">
            <div className="UserSmall__Username">
            { _.capitalize(this.props.user.firstName) } { _.capitalize(this.props.user.lastName) }
            </div>
          </div>
        </div>
      </Link>
    );
  }
});

module.exports = UserSmall;
