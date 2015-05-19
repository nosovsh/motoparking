var React = require("react/addons"),
    Fluxxor = require("fluxxor"),
    CSSTransitionGroup = React.addons.CSSTransitionGroup;

var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

require("./style.css");

var Toaster = React.createClass({

    mixins: [FluxMixin, StoreWatchMixin("ToastStore")],

    render: function () {
        var toastsComponents = this.state.toasts.map(function (toast) {
            return <Toast toast={ toast } />
        });
        return (

            <div className="Toaster">
                <CSSTransitionGroup transitionName="Toast">
                        { toastsComponents }
                </CSSTransitionGroup>
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

    render() {
        var messageRows = this.props.toast.message.split("\n").map(function (str) {
            return <p>{ str }</p>
        });

        return <div className="Toast" key={ this.props.toast.id }> { messageRows } </div>
    }
});

module.exports = Toaster;