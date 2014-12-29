var OpinionConstants = require("./OpinionConstants");
var OpinionClient = require("./OpinionClient");
var _ = require("lodash");

var OpinionActions = {
  loadOpinions: function(parkingId) {
    this.dispatch(OpinionConstants.LOAD_OPINIONS, {parkingId: parkingId});

    OpinionClient.loadOpinions(parkingId, function (opinions) {
      this.dispatch(OpinionConstants.LOAD_OPINIONS_SUCCESS, {parkingId: parkingId, opinions: opinions})
    }.bind(this), function(error) {
      this.dispatch(OpinionConstants.LOAD_OPINIONS_FAIL, {error: error});
    })
  },
  postOpinion: function(opinion) {
    opinion = _.merge({}, opinion);
    opinion.tempId = _.uniqueId() + "b";
    opinion.status = 'SAVING';
    this.dispatch(OpinionConstants.POST_OPINION, {opinion: opinion});

    OpinionClient.postOpinion(opinion, function (opinion) {
      this.dispatch(OpinionConstants.POST_OPINION_SUCCESS, {opinion: opinion})
    }.bind(this), function(error) {
      this.dispatch(OpinionConstants.POST_OPINION_FAIL, {opinion: opinion, error: error});
    })
  }
};

module.exports = OpinionActions;