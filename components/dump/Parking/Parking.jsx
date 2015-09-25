var React = require("react/addons");

var Router = require("react-router");
var Link = Router.Link;

var StatusCover = require("../StatusCover");
var MyOpinion = require("../MyOpinion");
var Icon = require("../dump/Icon/Icon");
var Comments = require("../Comments");
var Slider = require("../Slider");
var Sidebar = require("../dump/Sidebar/Sidebar");
var AvatarList = require("../dump/AvatarList/AvatarList");

require("./style.css");


var Parking = React.createClass({
  propTypes: {
    loading: React.PropTypes.bool,
    error: React.PropTypes.bool,
    currentParking: React.PropTypes.object.isRequired,
    currentParkingOpinions: React.PropTypes.array.isRequired,
    comments: React.PropTypes.array.isRequired,
    currentUser: React.PropTypes.object.isRequired,
    onEditLocation: React.PropTypes.func.isRequired,
    onDeleteParking: React.PropTypes.func.isRequired
  },

  render: function() {
    return (
      <Sidebar>
        <div>
            { this.props.currentUser.isSuper ?
              <a href="#" style={ {color: "#FFF"} } onClick={ this.props.onDeleteParking }>
                <div className="close-wrapper" style={{right: "inherit", left: 6}}>
                  <Icon name="delete" />
                </div>
              </a> : null }

          <Link to="Default" style={ {color: "#FFF"} }>
            <div className="close-wrapper">
              <Icon name="close" />
            </div>
          </Link>

          <StatusCover isSecure={ this.props.currentParking.isSecure }  isMoto={ this.props.currentParking.isMoto }/>
          { this.props.currentParking.isFullParkingLoaded ? (
            <div>
              <AvatarList users={ this.props.currentParking.users } />

                  { this.props.currentParking.isMoto === "yes" ?
                    <div className="Prices">
                      <div className="Prices__Price">
                        <div className="Prices__Price__Label">
                          Сутки
                        </div>
                        <div className="Prices__Price__Value">
                                  { this.props.currentParking.pricePerDay ?
                                    <div>
                                          { this.props.currentParking.pricePerDay }
                                      <Icon name="rouble" additionalClasses={ ["Rouble"] } />
                                    </div> : "?" }

                        </div>
                      </div>

                      <div className="Prices__Price">

                        <div className="Prices__Price__Label">
                          Месяц
                        </div>
                        <div className="Prices__Price__Value">
                                  { this.props.currentParking.pricePerMonth ?
                                    <div>
                                          { this.props.currentParking.pricePerMonth }
                                      <Icon name="rouble" additionalClasses={ ["Rouble"] } />
                                    </div> : "?" }
                        </div>
                      </div>

                    </div> : null }

              <Slider images={ this.props.currentParking.images } />

              <div className="InfoRow">
                <div className="Address">{ this.props.currentParking.address }&nbsp;</div>
                      { this.props.currentUser && this.props.currentUser.id === this.props.currentParking.user ?
                        <Icon name="edit" additionalClasses={ ["edit-location-button"] } onClick={ this.props.onEditLocation }/> :
                        null }
              </div>

              <MyOpinion parking={ this.props.currentParking }/>

              <Comments comments={ this.props.comments } />
            </div>) :
            <div className="loading">Loading...</div> }
        </div>
      </Sidebar>
    );
  }
});

module.exports = Parking;