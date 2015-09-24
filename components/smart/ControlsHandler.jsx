var React = require("react/addons");
var Fluxxor = require("fluxxor");

var Controls = require("../dump/Controls/Controls");
var ControlButton = require("../dump/Controls/ControlButton/ControlButton");
var Avatar = require("../dump/Avatar/Avatar");
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
        <ControlButton isRound onClick={ this.onMenuTriggerClick }>
          <Avatar
            user={ this.state.currentUser }
            size="small"
          />
        </ControlButton>
        <Link to="NewParking">
          <ControlButton>
            <Icon name="add"/>
            Добавить парковку
          </ControlButton>
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
        <ControlButton isRound onClick={ this.onMenuTriggerClick }>
          <Icon name="menu"/>
        </ControlButton>

        <a href="/login">
          <ControlButton>
            <Icon name="add"/>
            Добавить парковку
          </ControlButton>
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
          <ControlButton isRound onClick={ this.onPlusClick }>
            <Icon name="plus"/>
          </ControlButton>
          <ControlButton isRound onClick={ this.onMinusClick }>
            <Icon name="minus"/>
          </ControlButton>
          <ControlButton isRound onClick={ this.onMyLocationClick }>
            <Icon name="location" style={ {"marginLeft": "-3"} }/>
          </ControlButton>
        </Controls>
      </div>
    );
  }
});

module.exports = ControlsHandler;
