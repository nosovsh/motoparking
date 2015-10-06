var React = require("react/addons");
var ReactRouter = require("react-router");
var Link = ReactRouter.Link;

var Avatar = require("../Avatar/Avatar");
var Icon = require("../Icon/Icon");
var Opinion = require("../Parking/Opinion/Opinion");

require("./User.css");


var User = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    opinions: React.PropTypes.object,
    parkings: React.PropTypes.object
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
          <div>
            <div className="User__SocialConnections">
              { this.props.user.socialConnections.map(function(socialConnection) {
                return (
                  <a href={socialConnection.profileUrl} target="_blank">
                    <Icon name={socialConnection.provider.toLowerCase()} />
                  </a>
                );
              }) }
            </div>
            { this.props.user.opinionIds ? (
              <div>
                <div className="User__Header">Последние мнения</div>
                { this.props.user.opinionIds.map(function(opinionId) {
                  return (
                    <Opinion
                      user={ this.props.user }
                      opinion={ this.props.opinions[opinionId] }
                      parking={ this.props.parkings[this.props.opinions[opinionId].parking] }
                      />
                  );
                }.bind(this)) }
              </div>
            ) : null }
          </div>
        ) : <div>Loading...</div> }
      </div>
    );
  }
});

module.exports = User;
