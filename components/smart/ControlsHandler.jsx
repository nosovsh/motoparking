var React = require("react/addons");
var Fluxxor = require("fluxxor");

require("normalize.css/normalize.css");
require("./style.css");

var Controls = require("../Controls");
var Avatar = require("../Avatar");
var Icon = require("../Icon");
var DropDownMenu = require("../DropDownMenu").DropDownMenu;
var ButtonRow = require("../ButtonRow");


// Require React-Router
var Router = require("react-router");
var Navigation = Router.Navigation;
var Link = Router.Link;

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;


var ControlsHandler = React.createClass({
  mixins: [Navigation, FluxMixin, StoreWatchMixin("ParkingStore")],

  onPlusClick: function() {
    this.getFlux().actions.mapZoomIn();
  },

  onMinusClick: function() {
    this.getFlux().actions.mapZoomOut();
  },

  onMyLocationClick: function() {
    this.getFlux().actions.mapMyLocation();
  },

  onMenuTriggerClick: function() {
    this.refs.menu.toggle();
  },

  getStateFromFlux: function() {
    var currentUserStore = this.getFlux().store("CurrentUserStore");

    return {
      currentUser: currentUserStore.currentUser,
      isAuthorized: currentUserStore.isAuthorized()
    };
  },

  logout: function() {
    window.location = "/logout";
  },

  login: function() {
    this.getFlux().actions.authorizationRequired();
  },

  authorizedMenu: function() {
    return (
      <Controls>
        <div className="control-btn control-btn-round">
          <Avatar
            user={ this.state.currentUser }
            style={{
              width: 38,
              height: 38
            }}
            onClick={ this.onMenuTriggerClick }
          />
        </div>
        <Link to="NewParking">
          <div className="control-btn">
            <Icon name="add"/>
            Добавить парковку
          </div>
        </Link>
        <DropDownMenu ref="menu">
          <ButtonRow align="left" color="dark" callback={ this.transitionTo.bind(this, "Info") }>О проекте</ButtonRow>
          <ButtonRow align="left" color="dark" callback={ this.logout }>Выйти</ButtonRow>
        </DropDownMenu>
      </Controls>
    );
  },

  notAuthorizedMenu: function() {
    return (
      <Controls>
        <div className="control-btn control-btn-round" onClick={ this.onMenuTriggerClick }>
          <Icon name="menu"/>
        </div>

        <a href="/login">
          <div className="control-btn">
            <Icon name="add"/>
            Добавить парковку
          </div>
        </a>

        <DropDownMenu ref="menu">
          <ButtonRow align="left" color="dark" callback={ this.transitionTo.bind(this, "Info") }>О проекте</ButtonRow>
          <ButtonRow align="left" color="dark" callback={ this.login }>Войти</ButtonRow>
        </DropDownMenu>
      </Controls>
    );
  },

  render: function() {
    return (
      <div>
            { this.state.isAuthorized ? this.authorizedMenu() : this.notAuthorizedMenu() }
        <Controls isSecondary>
          <div className="control-btn control-btn-round" onClick={ this.onPlusClick }>
            <Icon name="plus"/>
          </div>
          <div className="control-btn control-btn-round" onClick={ this.onMinusClick }>
            <Icon name="minus"/>
          </div>
          <div className="control-btn control-btn-round" onClick={ this.onMyLocationClick }>
            <Icon name="location" style={ {"marginLeft": "-3"} }/>
          </div>
        </Controls>
      </div>
    );
  }
});

module.exports = ControlsHandler;
