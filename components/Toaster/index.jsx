var React = require("react/addons"),
    Fluxxor = require("fluxxor"),
    TimeoutTransitionGroup = require("react-components/js/timeout-transition-group"),
    _ = require("lodash");

var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

require("./style.css");

var Toaster = React.createClass({

    mixins: [FluxMixin, StoreWatchMixin("ToastStore")],

    render: function () {
        var toastsComponents = this.state.toasts.map(function (toast) {
            return (
                <Toast toast={ toast } />
            );
        });
        return (
            <div className="Toaster">
                <TimeoutTransitionGroup
                    enterTimeout={1000}
                    leaveTimeout={1000}
                    transitionName="Toast">
                        { toastsComponents }
                </TimeoutTransitionGroup>
            </div>
        )
    },

    getStateFromFlux: function () {
        var toastStore = this.getFlux().store("ToastStore");

        return {
            toasts: toastStore.toasts
        };
    }
});

var Toast = React.createClass({

    propTypes: {
        toast: React.PropTypes.object.isRequired
    },

    render: function () {
        var messageRows = _.map(this.props.toast.message.split("\n"), function (str) {
            return (
                <p>{ str }</p>
            )
        });

        return <div className="Toast" key={ this.props.toast.id }> { messageRows } </div>
    }
});

module.exports = Toaster;