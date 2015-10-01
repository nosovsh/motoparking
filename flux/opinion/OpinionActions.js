var OpinionConstants = require("./OpinionConstants");
var OpinionClient = require("./OpinionClient");
var _ = require("lodash");

var OpinionActions = {
  loadOpinions: function(parkingId) {
    // currently this action is not used
    this.dispatch(OpinionConstants.LOAD_OPINIONS, {parkingId: parkingId});

    OpinionClient.loadOpinions(parkingId, function(opinions) {
      this.dispatch(OpinionConstants.LOAD_OPINIONS_SUCCESS, {parkingId: parkingId, opinions: opinions});
    }.bind(this), function(error) {
      this.dispatch(OpinionConstants.LOAD_OPINIONS_FAIL, {error: error});
    }.bind(this));
  },

  postOpinion: function(opinion) {
    // TODO: move statuses to constants
    var newOpinion = _.merge({}, opinion);
    newOpinion.status = "SAVING";
    this.dispatch(OpinionConstants.POST_OPINION, {opinion: newOpinion});

    OpinionClient.postOpinion(newOpinion, function(returnedOpinion) {
      this.dispatch(OpinionConstants.POST_OPINION_SUCCESS, {opinion: returnedOpinion});
    }.bind(this), function(error) {
      this.dispatch(OpinionConstants.POST_OPINION_FAIL, {opinion: newOpinion, error: error});
    }.bind(this));
  },

  editOpinion: function() {
    this.dispatch(OpinionConstants.EDIT_OPINION, {});
  }
};

module.exports = OpinionActions;
