/*
* Node Version: V12.3+
* File Name: gas_price_synchronizer
* Auther: Yao
* Date Created: 2021-06-29
*/


const {integration: __integration__} = require("../config/config");
const assert                         = require("assert");
const logger                         = require("node-common-sdk").logger();
const {lodash}                       = require("node-common-sdk").helper;
const {Decimal}                      = require("node-common-sdk").util;
const {JobBase}                      = require("node-common-sdk/lib/scheduler");
const {HttpConnection}               = require("node-common-sdk/lib/connection/http");
const {GasPriceDaoView}              = require("../dao");


class SynchronizerJob extends JobBase {
    constructor(parameter) {
        super(parameter);

        this.chain    = "";
        this.source   = "";
        this.url      = "";
        this.gasPrice = new GasPriceDaoView();
    }

    async getGasPrice() {
        return {};
    }

    /**
     * @returns {Promise<void>}
     */
    async execute() {
        const data           = await this.getGasPrice();
        const [row, created] = await this.gasPrice.findOrCreate(
            {
                chain:  data.chain,
                source: data.source,
            },
            data);
        if (!created) {
            row.fastest = data.fastest;
            row.fast    = data.fast;
            if (data.maxPriorityFee) {
                row.maxPriorityFee = data.maxPriorityFee;
            }

            await row.save();
        }

        logger.info({
            ...this.context,
            message: `chain=${this.chain}||source=${this.source}||fastest=${data.fastest}||fast=${data.fast}||maxPriorityFee=${data.maxPriorityFee}`,
        });
    }

}

/**
 * 2,000 - API Credits Remaining for free
 */
class ETHGasStationSynchronizerJob extends SynchronizerJob {
    constructor(parameter) {
        super(parameter);

        this.chain  = "eth";
        this.source = "ethgasstation";
        this.url    = __integration__.ethGasStation;
    }

    async getGasPrice() {
        const result = await HttpConnection.get(this.parameter, this.url);

        return {
            "chain":   this.chain,
            "fastest": new Decimal.BigNumber(result.fastest).div(10).toString(),
            "fast":    new Decimal.BigNumber(result.fast).div(10).toString(),
            "source":  this.source,
        };
    }

}


class ETHGasNowSynchronizerJob extends SynchronizerJob {
    constructor(parameter) {
        super(parameter);

        this.chain  = "eth";
        this.source = "gasnow";
        this.url    = __integration__.ethGasNow;
    }

    async getGasPrice() {
        const result = await HttpConnection.get(this.parameter, this.url);
        assert(result.code === 200, "invalid response code");

        return {
            "chain":   this.chain,
            "fastest": new Decimal.BigNumber(result.data.rapid).div("1000000000").toString(),
            "fast":    new Decimal.BigNumber(result.data.fast).div("1000000000").toString(),
            "source":  this.source,
        };
    }

}


class ETHBlockNativeSynchronizerJob extends SynchronizerJob {
    constructor(parameter) {
        super(parameter);

        this.chain  = "eth";
        this.source = "blocknative";
        this.url    = __integration__.ethBlockNative;
    }

    async getGasPrice() {
        const result = await HttpConnection.get(this.parameter, this.url);
        assert(result.system === "ethereum" && result.network === "main" && result.unit === "gwei", "invalid response data");
        const data = lodash.first(lodash.first(result.blockPrices).estimatedPrices);

        return {
            "chain":          this.chain,
            "fastest":        new Decimal.BigNumber(data.maxFeePerGas).toString(),
            "fast":           new Decimal.BigNumber(data.price).toString(),
            "maxPriorityFee": new Decimal.BigNumber(data.maxPriorityFeePerGas).toString(),
            "source":         this.source,
        };
    }

}


class ETHGasPriceSynchronizerJob extends SynchronizerJob {
    constructor(parameter) {
        super(parameter);

        this.chain       = "eth";
        this.source      = "blocknative";
        this.blockNative = new ETHBlockNativeSynchronizerJob(parameter);
    }

    async getGasPrice() {
        // const base = await this.gasStation.getGasPrice();
        // try {
        //     const extend = await this.blockNative.getGasPrice();
        //
        //     // S1.maxPriorityFee∈(1, base.fastest)
        //     if (new Decimal.BigNumber(extend.maxPriorityFee).gt(1) && new Decimal.BigNumber(extend.maxPriorityFee).lt(base.fastest)) {
        //         base.maxPriorityFee = extend.maxPriorityFee;
        //     }
        //
        //     // S2.extend.fastest∈(base.fastest, 2base.fastest)
        //     if (new Decimal.BigNumber(extend.fastest).gt(base.fastest) && new Decimal.BigNumber(extend.maxPriorityFee).div(2).lt(base.fastest)) {
        //         base.fastest = extend.fastest;
        //     }
        // } catch (e) {
        //     logger.stack(e);
        // }

        return await this.blockNative.getGasPrice();
    }
}


module.exports = {
    ETHGasPriceSynchronizerJob,
};
