var Fluxxor = require("fluxxor");
var ParkingStore = require("./flux/parking/ParkingStore");
var OpinionStore = require("./flux/opinion/OpinionStore");
var CurrentUserStore = require("./flux/currentUser/CurrentUserStore");
var CommentStore = require("./flux/comment/CommentStore");
var ParkingActions = require("./flux/parking/ParkingActions");
var OpinionActions = require("./flux/opinion/OpinionActions");
var CurrentUserActions = require("./flux/currentUser/CurrentUserActions");
var CommentActions = require("./flux/comment/CommentActions");

var stores = {
  ParkingStore: new ParkingStore(),
  OpinionStore: new OpinionStore(),
  CurrentUserStore: new CurrentUserStore(),
  CommentStore: new CommentStore()
};

var actions = _.extend(ParkingActions, OpinionActions, CurrentUserActions, CommentActions);

var flux = new Fluxxor.Flux(stores, actions);

window.flux = flux;

flux.on("dispatch", function(type, payload) {
  if (console && console.log) {
    console.log("[Dispatch]", type, payload);
  }
});

module.exports = flux;