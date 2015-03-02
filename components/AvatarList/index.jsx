var React = require("react/addons"),
    _ = require("lodash");

require("./style.css");

var Avatar = require("../Avatar");

var DEFAULT_GAP = 20;
var HOVER_GAP = 40;

var AvatarList = React.createClass({
    propTypes: {
        users: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
    },
    getInitialState: function () {
        return {
            gap: 0 // px between objects
        }
    },
    render: function () {
        var rightmostTransform = (this.state.gap / 2) * (this.props.users.length - 1); // position of the right element

        var avatarComponents = _.map(this.props.users, function (user, i) {
            var translateX = rightmostTransform - i * this.state.gap;
            var style = {
                "webkitTransform": "translate(" + translateX + "px ,0)" // TODO: browser specific
            };
            return (
                <div className="AvatarList__Object" style={ style } key={ user._id }>
                    <Avatar user={ user } />
                </div>
            )
        }.bind(this));
        return (
            <div className="AvatarList" onMouseEnter={ this.onMouseEnter } onMouseLeave={ this.onMouseLeave } >
                { avatarComponents }
            </div>
        )
    },
    componentDidMount: function () {
        setTimeout(function () {
            this.setState({gap: DEFAULT_GAP})

        }.bind(this), 0)
    },
    onMouseEnter: function () {
        this.setState({gap: HOVER_GAP})
    },
    onMouseLeave: function () {
        this.setState({gap: DEFAULT_GAP})
    }
});

module.exports = AvatarList;
