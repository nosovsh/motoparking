var Fluxxor = require("fluxxor"),
    CommentConstants = require("./CommentConstants"),
    _ = require("lodash"),
    analytics = require('../../utils/analytics');


var CommentStore = Fluxxor.createStore({
    initialize: function () {
        this.loading = false;
        this.error = null;
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

    onLoadComments: function (payload) {
        this.loading = true;
        this.emit("change");
    },

    onLoadCommentsSuccess: function (payload) {
        this.commentsByParking[payload.parkingId] = payload.comments;
        this.loading = false;
        this.error = null;
        this.emit("change");
    },

    onLoadCommentsFail: function (payload) {
        this.loading = false;
        this.error = payload.error;
        this.emit("change");
    },

    onPostComment: function (payload) {
        this.loading = true;
        var comment = _.extend({}, payload.comment);
        comment.user = this.flux.store("CurrentUserStore").currentUser;
        this.commentsByParking[comment.parking] = this.commentsByParking[comment.parking] || [];
        this.commentsByParking[comment.parking].unshift(comment);
        this.emit("change");
    },

    onPostCommentSuccess: function (payload) {
        _.each(this.commentsByParking[payload.comment.parking.id], function (comment, i) {
            if (comment.tempId == payload.comment.tempId) {
                this.commentsByParking[payload.comment.parking.id][i] = payload.comment;
            }
        }.bind(this));
        this.loading = false;
        this.error = null;
        analytics.event("Comment", "created");
        this.emit("change");
    },

    onPostCommentFail: function (payload) {
        _.each(this.commentsByParking[payload.comment.parkingId], function (comment) {
            if (comment.tempId = payload.comment.tempId) {
                comment.status = 'FAIL';
            }
        });
        this.loading = false;
        this.error = payload.error;
        this.emit("change");
    },

    getComments: function (parkingId) {
        return this.commentsByParking[parkingId] || []
    }
});

module.exports = CommentStore;