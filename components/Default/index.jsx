var React = require("react"),
    Fluxxor = require("fluxxor");

require("./style.css");

var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Default = React.createClass({
    mixins: [FluxMixin],
    render: function () {
        return <div>
        </div>;
    },
    componentWillReceiveProps: function () {
        this.getFlux().actions.unselectCurrentParking();
    }
});

module.exports = Default;
