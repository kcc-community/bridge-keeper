/*
* Node Version: V12.3+
* File Name: config
* Auther: Yao
* Date Created: 2021-06-28
*/


const path = require("path");
require("dotenv").config({path: path.join(__dirname, "../../.env")});

const config = {
    blockchain:  {
        testnet: process.env.TESTNET === "true",
    },
    integration: {
        ethGasStation:  process.env.ETH_GAS_STATION,
        ethGasNow:      process.env.ETH_GAS_NOW,
        ethBlockNative: process.env.ETH_BLOCK_NATIVE,
        ethFullnode:    process.env.ETH_FULLNODE,
        kccFullnode:    process.env.KCC_FULLNODE,
        bscFullnode:    process.env.BSC_FULLNODE,
    },
    gateway:     {
        name:       "gateway",
        host:       "0.0.0.0",
        port:       8010,
        logDir:     path.join(__dirname, "../../logs/gateway"),
        logLevel:   "info",
        prefix:     "/v1/bridge/keeper",
        pagination: {
            page:  1,
            limit: 100,
        },
    },
    cronjob:     {
        eth_core_event_synchronizer: {
            name:     "cronjob-eth-core-event",
            logDir:   path.join(__dirname, "../../logs/cronjob/eth-core-event"),
            logLevel: "info",
            schedule: "*/60 * * * * *",
        },
        bsc_core_event_synchronizer: {
            name:     "cronjob-bsc-core-event",
            logDir:   path.join(__dirname, "../../logs/cronjob/bsc-core-event"),
            logLevel: "info",
            schedule: "*/60 * * * * *",
        },
        eth_gasprice_synchronizer:   {
            name:     "cronjob-eth-gasprice",
            logDir:   path.join(__dirname, "../../logs/cronjob/eth-gasprice"),
            logLevel: "info",
            schedule: "*/60 * * * * *",
        },
        kcc_core_event_synchronizer: {
            name:     "cronjob-kcc-core-event",
            logDir:   path.join(__dirname, "../../logs/cronjob/kcc-core-event"),
            logLevel: "info",
            schedule: "*/60 * * * * *",
        },
        kcc_pair_event_synchronizer: {
            name:     "cronjob-kcc-pair-event",
            logDir:   path.join(__dirname, "../../logs/cronjob/kcc-pair-event"),
            logLevel: "info",
            schedule: "*/60 * * * * *",
        },
    },
    mysql:       {
        url:     process.env.DATABASE,
        options: {
            pool:      {
                max: 50,
                min: 10,
            },
            define:    {
                timestamps:      false,
                freezeTableName: true,
            },
            timezone:  "+00:00",
            benchmark: true,
        },
        echo:    true,
    },
};


module.exports = config;
