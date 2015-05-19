var React = require("react/addons"),
    Fluxxor = require("fluxxor"),
    CSSTransitionGroup = React.addons.CSSTransitionGroup;

require("normalize.css/normalize.css");
require("./style.css");

var Router = require('react-router'),
    Link = Router.Link;

var Map = require('../Map'),
    Controls = require('../Controls'),
    Avatar = require("../Avatar"),
    Icon = require("../Icon"),
    Toaster = require("../Toaster");


// Require React-Router
var Router = require('react-router');
var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute = Router.DefaultRoute;
var RouteHandler = Router.RouteHandler;

var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;


var InnerApplication = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin("ParkingStore")],
    render: function () {
        return (
            <div>
                <Controls>
                    <div className="control-btn control-btn_avatar_true">
                        <Avatar
                            user={ this.state.currentUser }
                            style={{
                                width: 38,
                                height: 38
                            }}/>
                    </div>
                    <Link to="NewParking">
                        <div className="control-btn">
                            <Icon name="add"/>
                            Добавить парковку
                        </div>
                    </Link>
                </Controls>
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

    getStateFromFlux: function () {
        var store = this.getFlux().store("ParkingStore");
        var currentUserStore = this.getFlux().store("CurrentUserStore");

        return {
            currentUser: currentUserStore.currentUser
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
                <CSSTransitionGroup transitionName="page" className="one-more-wrapper">

                    <RouteHandler  key={this.getHandlerKey()} />
                </CSSTransitionGroup>
                <Toaster />
            </div>
        );
    }
});

module.exports = Application;
