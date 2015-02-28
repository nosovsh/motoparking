var React = require("react/addons"),
    _ = require("lodash");

require("./style.css");

var Comment = require("../Comment"),
    CommentForm = require("../CommentForm");

var Comments = React.createClass({
    propTypes: {
        comments: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
    },
    render: function () {
        var commentsComponents = _.map(this.props.comments, function (comment) {
            return <Comment comment={ comment }  key={ comment._id }/>
        });
        return (
                <div className="Comments">
                    <CommentForm />
                    { commentsComponents }
                </div>
        )
    }
});

module.exports = Comments;
