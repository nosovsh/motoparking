var React = require("react"),
    Fluxxor = require("fluxxor");

require("./style.css");

var FluxMixin = Fluxxor.FluxMixin(React);

var Router = require('react-router'),
    Link = Router.Link;

var Icon = require("../Icon");


var Controls = React.createClass({
    mixins: [FluxMixin],
    render: function () {
        return (
            <div className="controls__wrapper">
                <div className="controls__content">
                    <div className="control-btn control-btn_icon_true">
                        <Icon name="user" />
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
    }
});

module.exports = Controls;
