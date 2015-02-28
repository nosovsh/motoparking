var React = require("react");

require("./style.css");

var Avatar = require("../Avatar");


var Comment = React.createClass({
    propTypes: {
        comment: React.PropTypes.object.isRequired
    },
    render: function () {
        return (
            <div className="Comment">
                <div className="Comment__AvatarWrapper">
                    <Avatar user={ this.props.comment.user } />
                </div>
                <div className="Comment__Data">
                    <div className="Comment__Username">
                        { this.props.comment.user.name }
                    </div>
                    <div className="Comment__Date">
                        Вчера
                    </div>
                    <div className="Comment__Text">
                        { this.props.comment.text }
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = Comment;
