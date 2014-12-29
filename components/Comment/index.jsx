var React = require("react");

require("./style.css");


var Comment = React.createClass({
    render: function () {
        return (
            <div>
                { this.props.opinion.comment }
                { this.props.opinion.status}
            </div>
        );
    }
});

module.exports = Comment;
