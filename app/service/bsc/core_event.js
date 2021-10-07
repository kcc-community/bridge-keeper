/*
* Node Version: V12.3+
* File Name: bsc_event_synchronizer
* Author: Yao
* Date Created: 2021-06-29
*/


const {cronjob: __cronjob__}         = require("../../config/config");
const logger                         = require("node-common-sdk").logger(__cronjob__.bsc_core_event_synchronizer.logDir, __cronjob__.bsc_core_event_synchronizer.logLevel, __cronjob__.bsc_core_event_synchronizer.name);
const {CronJob}                      = require("cron");
const {CronBase}                     = require("node-common-sdk/lib/scheduler");
const {AppHook}                      = require("../../middleware/hook");
const {BSCBridgeCoreSynchronizerJob} = require("../../scheduler/event");


process.on("SIGINT", AppHook.onStop);


const synchronizerScheduler = new CronBase(__cronjob__.bsc_core_event_synchronizer.name, [BSCBridgeCoreSynchronizerJob]);
new CronJob(__cronjob__.bsc_core_event_synchronizer.schedule, synchronizerScheduler.onUpdate.bind(synchronizerScheduler)).start();


module.exports = {};