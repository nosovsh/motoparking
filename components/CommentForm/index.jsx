var React = require("react");

require("./style.css");

var Avatar = require("../Avatar"),
    Button = require("../Button");


var CommentForm = React.createClass({
    propTypes: {},
    render: function () {
        var currentUser = {
            _id: "u1",
            name: "Гоша Шиков",
            pictureUrl: "/static/test/picture-gosha.png"
        };
        return (
            <div className="Comment">
                <div className="Comment__AvatarWrapper">
                    <Avatar user={ currentUser } />
                </div>
                <div className="Comment__Data">
                    <textarea className="Comment__Textarea" placeholder="Комментарий" />
                </div>
            </div>
        );
    },
    onSendComment: function () {

    }
});

module.exports = CommentForm;
