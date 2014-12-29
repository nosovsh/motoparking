var Fluxxor = require("fluxxor"),
    OpinionConstants = require("./OpinionConstants"),
    _ = require("lodash");

var OpinionStore = Fluxxor.createStore({
    initialize: function () {
        this.loading = false;
        this.error = null;
        this.opinionsByParking = {};

        this.bindActions(
            OpinionConstants.LOAD_OPINIONS, this.onLoadOpinions,
            OpinionConstants.LOAD_OPINIONS_SUCCESS, this.onLoadOpinionsSuccess,
            OpinionConstants.LOAD_OPINIONS_FAIL, this.onLoadOpinionsFail,

            OpinionConstants.POST_OPINION, this.onPostOpinion,
            OpinionConstants.POST_OPINION_SUCCESS, this.onPostOpinionSuccess,
            OpinionConstants.POST_OPINION_FAIL, this.onPostOpinionFail
        );
    },

    onLoadOpinions: function (payload) {
        this.loading = true;
        this.emit("change");
    },

    onLoadOpinionsSuccess: function (payload) {
        this.opinionsByParking[payload.parkingId] = payload.opinions;
        this.loading = false;
        this.error = null;
        this.emit("change");
    },

    onLoadOpinionsFail: function (payload) {
        this.loading = false;
        this.error = payload.error;
        this.emit("change");
    },

    onPostOpinion: function (payload) {
        this.loading = true;
        this.opinionsByParking[payload.opinion.parkingId] = this.opinionsByParking[payload.opinion.parkingId] || [];
        this.opinionsByParking[payload.opinion.parkingId].unshift(payload.opinion);
        this.emit("change");
    },

    onPostOpinionSuccess: function (payload) {
        _.each(this.opinionsByParking[payload.opinion.parkingId], function(opinion, i) {
            if(opinion.tempId == payload.opinion.tempId) {
                this.opinionsByParking[payload.opinion.parkingId][i] = payload.opinion;
            }
        }.bind(this));
        this.loading = false;
        this.error = null;
        this.emit("change");
    },

    onPostOpinionFail: function (payload) {
        _.each(this.opinionsByParking[payload.opinion.parkingId], function(opinion) {
            if(opinion.tempId = payload.opinion.tempId) {
                opinion.status = 'FAIL';
            }
        });
        this.loading = false;
        this.error = payload.error;
        this.emit("change");
    },

});

module.exports = OpinionStore;