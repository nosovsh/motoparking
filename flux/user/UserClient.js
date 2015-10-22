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
  },
  loadUsers: function(success, failure) {
    $.ajax({
      dataType: "json",
      url: "/api/users/",
      data: {},
      success: function(ret) {
        success(ret.data);
      },
      error: failure
    });
  }
};

module.exports = UserClient;
