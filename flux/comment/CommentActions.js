var CommentConstants = require("./CommentConstants");
var CommentClient = require("./CommentClient");
var _ = require("lodash");

var CommentActions = {
    loadCommentList: function (parkingId) {
        this.dispatch(CommentConstants.LOAD_COMMENT_LIST, {parkingId: parkingId});

        CommentClient.loadComments(parkingId, function (comments) {
            this.dispatch(CommentConstants.LOAD_COMMENT_LIST_SUCCESS, {parkingId: parkingId, comments: comments})
        }.bind(this), function (error) {
            this.dispatch(CommentConstants.LOAD_COMMENT_LIST_FAIL, {error: error});
        })
    },
    postComment: function (comment) {
        comment = _.merge({}, comment);
        comment.status = 'SAVING';
        comment.tempId = _.uniqueId("comment_");
        this.dispatch(CommentConstants.POST_COMMENT, {comment: comment});

        CommentClient.postComment(comment, function (comment) {
            this.dispatch(CommentConstants.POST_COMMENT_SUCCESS, {comment: comment})
        }.bind(this), function (error) {
            this.dispatch(CommentConstants.POST_COMMENT_FAIL, {comment: comment, error: error});
        })
    }
};

module.exports = CommentActions;