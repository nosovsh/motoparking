var Fluxxor = require("fluxxor");
var ParkingStore = require("./flux/parking/ParkingStore");
var ParkingActions = require("./flux/parking/ParkingActions");

var stores = {
  ParkingStore: new ParkingStore()
};

var flux = new Fluxxor.Flux(stores, ParkingActions);

window.flux = flux;

flux.on("dispatch", function(type, payload) {
  if (console && console.log) {
    console.log("[Dispatch]", type, payload);
  }
});

module.exports = flux;