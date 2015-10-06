var $ = require("jquery");

var UserClient = {
  loadUser: function(userId, success, failure) {
    $.ajax({
      dataType: "json",
      url: "/api/users/" + userId + "/",
      data: {},
      success: success,
      error: failure
    });
  }
};

module.exports = UserClient;
