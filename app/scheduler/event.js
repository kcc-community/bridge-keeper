/*
* Node Version: V12.3+
* File Name: synchronizer
* Auther: Yao
* Date Created: 2021-06-29
*/


const {
          blockchain:  __blockchain__,
          integration: __integration__,
      }                                  = require("../config/config");
const logger                             = require("node-common-sdk").logger();
const {Datetime}                         = require("node-common-sdk").util;
const {JobBase}                          = require("node-common-sdk/lib/scheduler");
const {Contract}                         = require("kcc-bridge-sdk-bsc").contract;
const {
          EventDaoView,
          RecordDaoView,
      }                                  = require("../dao");
const {MonitorBlockNumberBehind5Minutes} = require("../common/monitor");


class SynchronizerJob extends JobBase {
    static SECONDS = 5 * 60;
    static ETH     = "eth";
    static KCC     = "kcc";
    static BSC     = "bsc";

    constructor(parameter) {
        super(parameter);

        this.handler = null;
        this.type    = null;
        this.event   = new EventDaoView();
        this.record  = new RecordDaoView();
    }

    async execute() {
        const record = await this.record.queryRecord(this.handler.chain, this.type);
        if (!!!record) {
            logger.info({
                ...this.context,
                message: `chain=${this.handler.chain}||event=${this.type}||can't find record`,
            });
            return;
        }
        if (parseInt(Datetime.fromString1(record.updateTime).seconds) < (parseInt(Datetime.fromNow().seconds) - SynchronizerJob.SECONDS)) {
            logger.monitor(new MonitorBlockNumberBehind5Minutes().toString(`${record.updateTime}||keeper=${record.keeperBlockNumber}||latest=${record.latestBlockNumber}`));
        }

        const latest = await this.handler.getBlockNumber();
        const upper  = latest - this.confirmations;
        const lower  = record.keeperBlockNumber;
        for (let i = lower; i < upper; i += record.steps - 1) {
            let j = i + record.steps - 1;
            if (j > upper) {
                j = upper;
            }
            await this.runnable(i, j);
            await this.record.updateRecord({
                keeperBlockNumber: j,
                latestBlockNumber: latest,
            }, record.id);

            i++;
        }

        logger.info({
            ...this.context,
            message: `chain=${this.handler.chain}||lower=${lower}||upper=${upper}||confirmations=${this.confirmations}`,
        });
    }

    async runnable(fromBlock, toBlock) {
        logger.info({
            ...this.context,
            message: `fromBlock=${fromBlock}||toBlock=${toBlock}`,
        });

        const events = await this.handler.getEventList(fromBlock, toBlock);
        for (let event of events) {
            await this.event.findOrCreate(
                {
                    chain:    event.chain,
                    txHash:   event.txHash,
                    txIndex:  event.txIndex,
                    logIndex: event.logIndex,
                },
                event,
            );
        }
    }

}


class ETHBridgeCoreSynchronizerJob extends SynchronizerJob {
    constructor(parameter) {
        super(parameter);

        this.handler       = Contract.getBridgeCore(SynchronizerJob.ETH,
            {
                testnet:  __blockchain__.testnet,
                fullnode: __integration__.ethFullnode,
            });
        this.confirmations = this.handler.props.confirmations;
        this.type          = "bridge-core";
    }

}

class BSCBridgeCoreSynchronizerJob extends SynchronizerJob {
    constructor(parameter) {
        super(parameter);

        this.handler       = Contract.getBridgeCore(SynchronizerJob.BSC,
            {
                testnet:  __blockchain__.testnet,
                fullnode: __integration__.bscFullnode,
            });
        this.confirmations = this.handler.props.confirmations;
        this.type          = "bridge-core";
    }

}


class KCCBridgeCoreSynchronizerJob extends SynchronizerJob {
    constructor(parameter) {
        super(parameter);

        this.handler       = Contract.getBridgeCore(SynchronizerJob.KCC,
            {
                testnet:  __blockchain__.testnet,
                fullnode: __integration__.kccFullnode,
            });
        this.confirmations = this.handler.props.confirmations;
        this.type          = "bridge-core";
    }

}


class KCCBridgePairSynchronizerJob extends SynchronizerJob {
    constructor(parameter) {
        super(parameter);

        this.handler       = Contract.getBridgePair(SynchronizerJob.KCC, {
            testnet:  __blockchain__.testnet,
            fullnode: __integration__.kccFullnode,
        });
        this.confirmations = this.handler.props.confirmations;
        this.type          = "bridge-pair";
    }

}


module.exports = {
    BSCBridgeCoreSynchronizerJob,
    ETHBridgeCoreSynchronizerJob,
    KCCBridgeCoreSynchronizerJob,
    KCCBridgePairSynchronizerJob,
};