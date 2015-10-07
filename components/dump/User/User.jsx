var React = require("react/addons");

var Avatar = require("../Avatar/Avatar");
var Icon = require("../Icon/Icon");
var Opinion = require("../Parking/Opinion/Opinion");
var SidebarTable = require("../SidebarTable/SidebarTable");

require("./User.css");


var User = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    opinions: React.PropTypes.object,
    parkings: React.PropTypes.object
  },

  getDefaultProps: function() {
    return {
      user: {}
    };
  },


  render: function() {
    return (
      <div className="User">
        <div className="User__Cover">
          <Avatar user={ this.props.user } size="big" border="thin"/>
          { this.props.user ? (
            <div className="User__Name">
              { _.capitalize(this.props.user.firstName) } { _.capitalize(this.props.user.lastName) }
            </div>
          ) : null }
        </div>
        { this.props.user.fullUserLoaded ? (
          <div>
            <div className="User__SocialConnections">
              { this.props.user.socialConnections.map(function(socialConnection) {
                return (
                  <a href={socialConnection.profileUrl} target="_blank">
                    <Icon name={socialConnection.provider.toLowerCase()} isExpandOnHover/>
                  </a>
                );
              }) }
            </div>

            <SidebarTable
              data={[{
                "label": "Добавлено парковок",
                "value": this.props.user.stats.parkingsCount
              }, {
                "label": "Оставлено мнений",
                "value": this.props.user.stats.opinionsCount
              }]} />

            <SidebarTable
              data={[{
                "label": "Комментариев",
                "value": this.props.user.stats.commentsCount
              }, {
                "label": "Фотографий",
                "value": this.props.user.stats.parkingImagesCount
              }]} />
            <br/>
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
