var Fluxxor = require("fluxxor");
var ParkingStore = require("./flux/parking/ParkingStore");
var OpinionStore = require("./flux/opinion/OpinionStore");
var ParkingActions = require("./flux/parking/ParkingActions");
var OpinionActions = require("./flux/opinion/OpinionActions");

var stores = {
  ParkingStore: new ParkingStore(),
  OpinionStore: new OpinionStore()
};

var actions = _.extend(ParkingActions, OpinionActions)

var flux = new Fluxxor.Flux(stores, actions);

window.flux = flux;

flux.on("dispatch", function(type, payload) {
  if (console && console.log) {
    console.log("[Dispatch]", type, payload);
  }
});

module.exports = flux;