/*
* Node Version: V12.3+
* File Name: eth_gas_price_synchronizer
* Auther: Yao
* Date Created: 2021-06-29
*/


const {cronjob: __cronjob__}       = require("../../config/config");
const logger                       = require("node-common-sdk").logger(__cronjob__.eth_gasprice_synchronizer.logDir, __cronjob__.eth_gasprice_synchronizer.logLevel, __cronjob__.eth_gasprice_synchronizer.name);
const {CronJob}                    = require("cron");
const {CronBase}                   = require("node-common-sdk/lib/scheduler");
const {AppHook}                    = require("../../middleware/hook");
const {ETHGasPriceSynchronizerJob} = require("../../scheduler/gasprice");


process.on("SIGINT", AppHook.onStop);


const synchronizerScheduler = new CronBase(__cronjob__.eth_gasprice_synchronizer.name, [ETHGasPriceSynchronizerJob]);
new CronJob(__cronjob__.eth_gasprice_synchronizer.schedule, synchronizerScheduler.onUpdate.bind(synchronizerScheduler)).start();


module.exports = {};