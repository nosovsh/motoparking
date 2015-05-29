var React = require("react/addons"),
    _ = require("lodash"),
    Events = require("utils/events");

require("./style.css");

var DropDownMenu = React.createClass({

    getInitialState: function () {
        return {
            open: false
        }
    },
    render: function () {
        return (
            <div>
                { this.state.open ? <div className="DropDownMenu">
                    <div className="DropDownMenu_Inner">
                        { this.props.children }
                    </div>
                    <div className="PopoverArrow"/>
                </div> : null}
            </div>
        )
    },
    componentDidMount: function () {
        Events.on(document, 'click', this.componentClickAway);
    },
    componentWillUnmount: function () {
        Events.off(document, 'click', this.componentClickAway);
    },

    componentClickAway: function () {
        if (this.state.open) {
            this.setState({open: false});
        }
    },
    toggle: function () {
        setTimeout(function () {
            this.setState({open: !this.state.open});
        }.bind(this), 0);
        return this;
    }
});

module.exports.DropDownMenu = DropDownMenu;
