var React = require("react/addons");
var ReactRouter = require("react-router");
var Link = ReactRouter.Link;

var Avatar = require("../Avatar/Avatar");
var Icon = require("../Icon/Icon");

require("./User.css");


var User = React.createClass({
  propTypes: {
    user: React.PropTypes.object
  },

  render: function() {
    if (!this.props.user) {
      return <div>loading</div>;
    }
    return (
      <div className="User">
        <div className="User__Cover">
          <Avatar user={ this.props.user } size="big" border="thin"/>
          <div className="User__Name">
            { _.capitalize(this.props.user.firstName) } { _.capitalize(this.props.user.lastName) }
          </div>
        </div>
        { this.props.user.fullUserLoaded ? (
          <div className="User__SocialConnections">
            { this.props.user.socialConnections.map(function(socialConnection) {
              return (
                <a href={socialConnection.profileUrl} target="_blank">
                  <Icon name={socialConnection.provider.toLowerCase()} />
                </a>
              );
            }.bind(this)) }
          </div>
        ) : <div>Loading...</div> }
      </div>
    );
  }
});

module.exports = User;
