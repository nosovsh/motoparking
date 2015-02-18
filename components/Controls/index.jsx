var React = require("react"),
    Fluxxor = require("fluxxor");

require("./style.css");

var FluxMixin = Fluxxor.FluxMixin(React);

var Icon = require("../Icon");


var Controls = React.createClass({
    mixins: [FluxMixin],
    render: function () {
        return (
            <div className="controls__wrapper">
                <div className="controls__content">
                    <div className="control-btn control-btn_icon_true" onClick={ this.newParkingEditLocation }>
                        <Icon name="user" />
                    </div>
                    <div className="control-btn" onClick={ this.newParkingEditLocation }>
                        <Icon name="add"/> Добавить парковку
                    </div>
                </div>
            </div>
        );
    },
    newParkingEditLocation: function () {
        this.getFlux().actions.newParkingEditLocation();
    }
});

module.exports = Controls;
