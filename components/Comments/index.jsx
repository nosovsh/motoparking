var React = require("react/addons");

var Comment = require("../Comment");
var CommentForm = require("../CommentForm");

require("./style.css");


var Comments = React.createClass({
  propTypes: {
    comments: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    currentUserIsAuthorized: React.PropTypes.bool,
    currentUser: React.PropTypes.object.isRequired,
    currentParkingId: React.PropTypes.string.isRequired,
    actions: React.PropTypes.object.isRequired
  },

  render: function() {
    var commentsComponents = this.props.comments.map(function(comment) {
      return (
        <Comment comment={ comment } key={ comment.tempId || comment.id}/>
      );
    });
    return (
      <div className="Comments">
        <CommentForm
          currentUserIsAuthorized={ this.props.currentUserIsAuthorized }
          currentUser={ this.props.currentUser }
          currentParkingId={ this.props.currentParkingId }
          actions={ this.props.actions }/>
        { commentsComponents }
      </div>
    );
  }
});

module.exports = Comments;
