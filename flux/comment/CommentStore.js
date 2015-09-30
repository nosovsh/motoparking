var Fluxxor = require("fluxxor");
var CommentConstants = require("./CommentConstants");
var _ = require("lodash");
var analytics = require("../../utils/analytics");


// TODO: move comment statues to constants
// TODO: implement proper error handling
var CommentStore = Fluxxor.createStore({
  initialize: function() {
    this.commentsByParking = {};

    this.bindActions(
      CommentConstants.LOAD_COMMENT_LIST, this.onLoadComments,
      CommentConstants.LOAD_COMMENT_LIST_SUCCESS, this.onLoadCommentsSuccess,
      CommentConstants.LOAD_COMMENT_LIST_FAIL, this.onLoadCommentsFail,

      CommentConstants.POST_COMMENT, this.onPostComment,
      CommentConstants.POST_COMMENT_SUCCESS, this.onPostCommentSuccess,
      CommentConstants.POST_COMMENT_FAIL, this.onPostCommentFail
    );
  },

  onLoadComments: function(payload) { // eslint-disable-line no-unused-vars
    this.emit("change");
  },

  onLoadCommentsSuccess: function(payload) {
    this.commentsByParking[payload.parkingId] = payload.comments;
    this.emit("change");
  },

  onLoadCommentsFail: function(payload) { // eslint-disable-line no-unused-vars
    // TODO: implement
    this.emit("change");
  },

  onPostComment: function(payload) {
    var comment = _.extend({}, payload.comment);
    // TODO: currentUser should be passed to action. I don't like using another store here
    comment.user = this.flux.store("CurrentUserStore").currentUser;
    this.commentsByParking[comment.parking] = this.commentsByParking[comment.parking] || [];
    this.commentsByParking[comment.parking].unshift(comment);
    this.emit("change");
  },

  onPostCommentSuccess: function(payload) {
    _.each(this.commentsByParking[payload.comment.parking.id], function(comment, i) {
      if (comment.tempId === payload.comment.tempId) {
        this.commentsByParking[payload.comment.parking.id][i] = payload.comment;
      }
    }.bind(this));
    analytics.event("Comment", "created");
    this.emit("change");
  },

  onPostCommentFail: function(payload) {
    _.each(this.commentsByParking[payload.comment.parkingId], function(comment) {
      if (comment.tempId === payload.comment.tempId) {
        comment.status = "FAIL";
      }
    });
    this.emit("change");
  },

  getComments: function(parkingId) {
    return this.commentsByParking[parkingId] || [];
  }
});

module.exports = CommentStore;
