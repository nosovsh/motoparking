var CommentConstants = require("./CommentConstants");
var CommentClient = require("./CommentClient");
var _ = require("lodash");

var CommentActions = {
  loadCommentList: function(parkingId) {
    this.dispatch(CommentConstants.LOAD_COMMENT_LIST, {parkingId: parkingId});

    CommentClient.loadComments(parkingId, function(comments) {
      this.dispatch(CommentConstants.LOAD_COMMENT_LIST_SUCCESS, {parkingId: parkingId, comments: comments});
    }.bind(this), function(error) {
      this.dispatch(CommentConstants.LOAD_COMMENT_LIST_FAIL, {error: error});
    }.bind(this));
  },

  postComment: function(comment) {
    var newComment = _.merge({}, comment);
    newComment.status = "SAVING";
    newComment.tempId = _.uniqueId("comment_");
    this.dispatch(CommentConstants.POST_COMMENT, {comment: newComment});

    CommentClient.postComment(newComment, function(returnedComment) {
      this.dispatch(CommentConstants.POST_COMMENT_SUCCESS, {comment: returnedComment});
    }.bind(this), function(error) {
      this.dispatch(CommentConstants.POST_COMMENT_FAIL, {comment: newComment, error: error});
    }.bind(this));
  }
};

module.exports = CommentActions;
