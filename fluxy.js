var Fluxxor = require("fluxxor");
var ParkingStore = require("./flux/parking/ParkingStore");
var OpinionStore = require("./flux/opinion/OpinionStore");
var CurrentUserStore = require("./flux/currentUser/CurrentUserStore");
var CommentStore = require("./flux/comment/CommentStore");
var ParkingImageStore = require("./flux/parkingImage/ParkingImageStore");
var ParkingActions = require("./flux/parking/ParkingActions");
var OpinionActions = require("./flux/opinion/OpinionActions");
var CurrentUserActions = require("./flux/currentUser/CurrentUserActions");
var CommentActions = require("./flux/comment/CommentActions");
var ParkingImageActions = require("./flux/parkingImage/ParkingImageActions");

var stores = {
  ParkingStore: new ParkingStore(),
  OpinionStore: new OpinionStore(),
  CurrentUserStore: new CurrentUserStore(),
  CommentStore: new CommentStore(),
  ParkingImageStore: new ParkingImageStore()
};

var actions = _.extend(ParkingActions, OpinionActions, CurrentUserActions, CommentActions, ParkingImageActions);

var flux = new Fluxxor.Flux(stores, actions);

window.flux = flux;

flux.on("dispatch", function(type, payload) {
  if (console && console.log) {
    console.log("[Dispatch]", type, payload);
  }
});

module.exports = flux;