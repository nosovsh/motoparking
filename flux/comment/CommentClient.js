var $ = require("jquery");


var CommentClient = {
  loadComments: function(parkingId, success, failure) {
    $.ajax({
      dataType: "json",
      url: "/api/comments/" + parkingId,
      data: {"parking": parkingId},
      success: success,
      error: failure
    });
  },

  postComment: function(comment, success, failure) {
    $.ajax({
      type: "POST",
      // dataType: "json",
      contentType: "application/json",
      url: "/api/comments/",
      data: JSON.stringify(comment),
      success: success,
      error: failure
    });
  }
};

module.exports = CommentClient;
