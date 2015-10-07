var React = require("react/addons");
var Fluxxor = require("fluxxor");

var Controls = require("../dump/Controls/Controls");
var ControlButton = require("../dump/Controls/ControlButton/ControlButton");
var Avatar = require("../dump/Avatar/Avatar");
var Icon = require("../dump/Icon/Icon");
var DropDownMenu = require("../dump/DropDownMenu/DropDownMenu").DropDownMenu;
var ButtonRow = require("../dump/ButtonRow/ButtonRow");


var Router = require("react-router");
var History = Router.History;
var Link = Router.Link;

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;


var ControlsHandler = React.createClass({
  mixins: [History, FluxMixin, StoreWatchMixin("ParkingStore")],

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

  onAbout: function() {
    this.history.pushState(null, "/about");
  },

  onProfile: function() {
    this.history.pushState(null, "/u/" + this.state.currentUser.id);
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
        <Link to="/add">
          <ControlButton>
            <Icon name="add"/>
            Добавить парковку
          </ControlButton>
        </Link>
        <DropDownMenu ref="menu">
          <ButtonRow align="left" color="dark" callback={ this.onProfile }>Мой профиль</ButtonRow>
          <ButtonRow align="left" color="dark" callback={ this.onAbout }>О проекте</ButtonRow>
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
          <ButtonRow align="left" color="dark" callback={ this.onAbout }>О проекте</ButtonRow>
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
