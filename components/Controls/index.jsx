var React = require("react"),
    Fluxxor = require("fluxxor");

require("./style.css");

var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Router = require('react-router'),
    Link = Router.Link;

var Icon = require("../Icon"),
    Avatar = require("../Avatar");


var Controls = React.createClass({

    mixins: [FluxMixin, StoreWatchMixin("CurrentUserStore")],

    render: function () {
        return (
            <div className="controls__wrapper">
                <div className="controls__content">
                    <div className="control-btn control-btn_avatar_true">
                        <Avatar user={ this.state.currentUser } style={ {width: 38, height: 38} }/>
                    </div>
                    <Link to="NewParking">
                        <div className="control-btn">
                            <Icon name="add"/> Добавить парковку
                        </div>
                    </Link>
                </div>
            </div>
        );
    },

    newParkingEditLocation: function () {
        this.getFlux().actions.newParkingEditLocation();
    },

    getStateFromFlux: function () {
        var currentUserStore = this.getFlux().store("CurrentUserStore");

        return {
            currentUser: currentUserStore.currentUser
        };
    }
});

module.exports = Controls;
