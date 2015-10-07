var React = require("react");
var _ = require("lodash");
var moment = require("moment");

var Router = require("react-router");
var Link = Router.Link;

var Avatar = require("../../Avatar/Avatar");

require("./Comment.css");


var Comment = React.createClass({
  propTypes: {
    comment: React.PropTypes.object.isRequired
  },

  render: function() {
    return (
      <div className="Comment">
        <div className="Comment__AvatarWrapper">
          <Link to={ "/u/" + this.props.comment.user.id}>
            <Avatar user={ this.props.comment.user } />
          </Link>
        </div>
        <div className="Comment__Data">
          <div className="Comment__Username">
            { _.capitalize(this.props.comment.user.firstName) } { _.capitalize(this.props.comment.user.lastName) }
          </div>
          <div className="Comment__Date">
            { moment(this.props.comment.created).fromNow() }
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
