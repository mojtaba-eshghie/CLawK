let contract_watcher = require('./contract-watcher');
let dcr_caller = require('./dcr-caller');
let WaitQueue = require('wait-queue');


let monitor = (address, dcr_id, sim_id, contract_abi) => {
  // Let contract_watcher to watch the contract
  // Returns a queue of events emitted from the contract; this queue is shared between subsystems of the monitor
  let contract_queue = contract_watcher(address, contract_abi);

  // Create a shared queue between dcr_caller, the top-level of the monitor, and other parts of the server-side (e.g. websocket server)
  // dcr_caller (producer) => monitor top-level (this index.js file) (consumer for dcr_caller, producer for other server parts) => websocket server (consumer)
  let monitor_results_queue = new WaitQueue();

  // Initiate the contract_caller...
  dcr_caller(contract_queue=contract_queue, dcr_id=dcr_id, sim_id=sim_id, monitor_results_queue=monitor_results_queue);

  return monitor_results_queue;
}



module.exports = monitor;