var _ = require("lodash"),
    $ = require("jquery");

var OpinionClient = {
    loadOpinions: function (parkingId, success, failure) {
        setTimeout(function () {
            //success(_.clone(opinions[parkingId]));
        }, 1000);
    },

    postOpinion: function (opinion, success, failure) {
        if (opinion.latLng) {
            opinion = _.extend({}, opinion, {latLng: opinion.latLng.coordinates});
        }
        // to prevent empty string
        opinion.pricePerDay = parseInt(opinion.pricePerDay)
        opinion.pricePerMonth = parseInt(opinion.pricePerMonth)

        $.ajax({
            type: "POST",
            //dataType: "json",
            contentType: "application/json",
            url: "/api/opinions/",
            data: JSON.stringify(opinion),
            success: function (ret) {
                success(ret)
            }
        });
    }
};

module.exports = OpinionClient;