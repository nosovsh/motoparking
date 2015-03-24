var React = require("react"),
    Fluxxor = require("fluxxor");

require("./style.css");

var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Router = require('react-router'),
    Link = Router.Link;


var Controls = React.createClass({

    mixins: [FluxMixin],

    propTypes: {
    },

    getDefaultProps: function () {
        return {
            secondary: false
        };
    },

    render: function () {
        var classes1 = {
            "controls__wrapper": true,
            "controls__wrapper_secondary": this.props.secondary
        };
        var classes2 = {
            "controls__content": true,
            "controls__content_secondary": this.props.secondary
        };
        return (
            <div className={ React.addons.classSet(classes1) }>
                <div className={ React.addons.classSet(classes2) }>
                    { this.props.children }
                </div>
            </div>
        );
    },

    newParkingEditLocation: function () {
        this.getFlux().actions.newParkingEditLocation();
    },

    getStateFromFlux: function () {

        return {
        };
    }
});

module.exports = Controls;
