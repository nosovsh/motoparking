var React = require("react/addons"),
    Fluxxor = require("fluxxor"),
    TimeoutTransitionGroup = require("react-components/js/timeout-transition-group");

require("normalize.css/normalize.css");
require("./style.css");

var Router = require('react-router'),
    Link = Router.Link;
var Navigation = Router.Navigation;


var Map = require('../Map'),
    Controls = require('../Controls'),
    Avatar = require("../Avatar"),
    Icon = require("../Icon"),
    DropDownMenu = require("../DropDownMenu").DropDownMenu,
    ButtonRow = require("../ButtonRow"),
    Toaster = require("../Toaster");


// Require React-Router
var Router = require('react-router');
var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute = Router.DefaultRoute;
var RouteHandler = Router.RouteHandler;

var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;


var InnerApplication = React.createClass({
    mixins: [Navigation, FluxMixin, StoreWatchMixin("ParkingStore")],
    render: function () {
        return (
            <div>
            { this.state.isAuthorized ? this.authorizedMenu() : this.notAuthorizedMenu() }
                <Controls secondary={ true }>
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
    },
    authorizedMenu: function () {
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
                        <ButtonRow align="left" callback={ this.transitionTo.bind(this, "Info") }>О проекте</ButtonRow>
                        <ButtonRow align="left" callback={ this.logout }>Выйти</ButtonRow>
                    </DropDownMenu>
            </Controls>
        )
    },
    notAuthorizedMenu: function () {
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
                    <ButtonRow align="left" callback={ this.transitionTo.bind(this, "Info") }>О проекте</ButtonRow>
                    <ButtonRow align="left" callback={ this.login }>Войти</ButtonRow>
                </DropDownMenu>
            </Controls>
        )
    },

    getStateFromFlux: function () {
        var store = this.getFlux().store("ParkingStore");
        var currentUserStore = this.getFlux().store("CurrentUserStore");

        return {
            currentUser: currentUserStore.currentUser,
            isAuthorized: currentUserStore.isAuthorized(),
        };
    },
    onPlusClick: function () {
        this.getFlux().actions.mapZoomIn()
    },
    onMinusClick: function () {
        this.getFlux().actions.mapZoomOut()
    },
    onMyLocationClick: function () {
        this.getFlux().actions.mapMyLocation()
    },
    onMenuTriggerClick: function () {
        this.refs.menu.toggle();
    },
    logout: function () {
        window.location = "/logout"
    },
    login: function () {
        window.location = "/login"
    }

});


var Application = React.createClass({
    mixins: [FluxMixin, Router.State],

    getHandlerKey: function () {
        var childDepth = 1;
        var childName = this.getRoutes()[childDepth].name;
        var key = childName;
        return key;
    },

    render: function () {
        return (
            <div>
                <Map/>
                <InnerApplication />
                <TimeoutTransitionGroup
                    enterTimeout={500}
                    leaveTimeout={500}
                    transitionName="page"
                    className="one-more-wrapper">
                    <RouteHandler  key={this.getHandlerKey()} />
                </TimeoutTransitionGroup>
                <Toaster />
            </div>
        );
    }
});

module.exports = Application;
