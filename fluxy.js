var _ = require("lodash");

var Fluxxor = require("fluxxor");
var ParkingStore = require("./flux/parking/ParkingStore");
var ParkingActions = require("./flux/parking/ParkingActions");

var OpinionStore = require("./flux/opinion/OpinionStore");
var OpinionActions = require("./flux/opinion/OpinionActions");

var CurrentUserStore = require("./flux/currentUser/CurrentUserStore");
var CurrentUserActions = require("./flux/currentUser/CurrentUserActions");

var CommentStore = require("./flux/comment/CommentStore");
var CommentActions = require("./flux/comment/CommentActions");

var ParkingImageStore = require("./flux/parkingImage/ParkingImageStore");
var ParkingImageActions = require("./flux/parkingImage/ParkingImageActions");

var AppStore = require("./flux/app/AppStore");
var AppActions = require("./flux/app/AppActions");

var ToastStore = require("./flux/toast/ToastStore");
var ToastActions = require("./flux/toast/ToastActions");


var stores = {
  ParkingStore: new ParkingStore(),
  OpinionStore: new OpinionStore(),
  CurrentUserStore: new CurrentUserStore(),
  CommentStore: new CommentStore(),
  ParkingImageStore: new ParkingImageStore(),
  AppStore: new AppStore(),
  ToastStore: new ToastStore()
};

var actions = _.extend(
    ParkingActions,
    OpinionActions,
    CurrentUserActions,
    CommentActions,
    ParkingImageActions,
    AppActions,
    ToastActions
);

var flux = new Fluxxor.Flux(stores, actions);

window.flux = flux;

flux.on("dispatch", function(type, payload) {
  if (console && console.log) {
    console.log("[Dispatch]", type, payload);
  }
});

module.exports = flux;
