var _ = require("lodash"),
    $ = require("jquery");

var CommentClient = {
    loadComments: function (parkingId, success, failure) {
        setTimeout(function () {
            $.ajax({
                dataType: "json",
                url: "/api/comments/" + parkingId,
                data: {"parking": parkingId},
                success: success
            })
        }, 0);
    },

    postComment: function (comment, success, failure) {
        $.ajax({
            type: "POST",
            //dataType: "json",
            contentType: "application/json",
            url: "/api/comments/",
            data: JSON.stringify(comment),
            success: function (ret) {
                success(ret)
            }
        });
    }
};

module.exports = CommentClient;