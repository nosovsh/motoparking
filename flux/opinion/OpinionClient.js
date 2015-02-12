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

        $.ajax({
            type: "POST",
            //dataType: "json",
            contentType: "application/json",
            url: "http://127.0.0.1:5000/api/opinions/",
            data: JSON.stringify(opinion),
            success: function (ret) {
                success(ret)
            }
        });
    }
};

module.exports = OpinionClient;