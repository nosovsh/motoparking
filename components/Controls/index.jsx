var React = require("react"),
    Fluxxor = require("fluxxor");

require("./style.css");

var FluxMixin = Fluxxor.FluxMixin(React);


var Controls = React.createClass({
    mixins: [FluxMixin],
    render: function () {
        return (
            <div className="controls__wrapper">
                <div className="controls__content">
                    <div className="control-btn" onClick={ this.newParkingEditLocation }>+</div>
                </div>
            </div>
        );
    },
    newParkingEditLocation: function () {
        this.getFlux().actions.newParkingEditLocation();
    }
});

module.exports = Controls;
