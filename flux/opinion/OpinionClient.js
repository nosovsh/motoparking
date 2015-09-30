var _ = require("lodash");
var $ = require("jquery");

var OpinionClient = {
  loadOpinions: function(parkingId, success, failure) { // eslint-disable-line no-unused-vars
    // currently opinions are not loaded from server so this method is not user
  },

  postOpinion: function(opinion, success, failure) {
    var newOpinion = _.extend({}, opinion);

    // fix different formats of `latLng` at server and at Leaflet.jss
    if (newOpinion.latLng) {
      newOpinion = _.extend({}, newOpinion, {latLng: newOpinion.latLng.coordinates});
    }

    // prevent empty string
    newOpinion.pricePerDay = parseInt(newOpinion.pricePerDay, 10);
    newOpinion.pricePerMonth = parseInt(newOpinion.pricePerMonth, 10);

    $.ajax({
      type: "POST",
      // dataType: "json",
      contentType: "application/json",
      url: "/api/opinions/",
      data: JSON.stringify(newOpinion),
      success: success,
      error: failure
    });
  }
};

module.exports = OpinionClient;
