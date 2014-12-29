var _ = require("lodash"),
    Faker = require("Faker");

var opinions = {
  1: [{
        id: 1,
        parkingId: 1,
        comment: "коммент 1"
      },{
        id: 2,
        parkingId: 1,
        comment: "коммент 2"
      },{
        id: 3,
        parkingId: 1,
        comment: "коммент 3"
      }],
  2: [{
        id: 4,
        parkingId: 2,
        comment: "коммент 4"
      },{
        id: 5,
        parkingId: 2,
        comment: "коммент 5"
      }],
  3: []
};

var OpinionClient = {
  loadOpinions: function(parkingId, success, failure) {
    setTimeout(function() {
      success(_.clone(opinions[parkingId]));
    }, 1000);
  },

  postOpinion: function(opinion, success, failure) {
    setTimeout(function() {
      opinion = _.merge(opinion, {id: _.uniqueId() + "a", status: null})
      opinions[opinion.parkingId].unshift(opinion);
      success(opinion);
    }, 1000);
  }
};

module.exports = OpinionClient;