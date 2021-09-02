/*
* Node Version: V12.3+
* File Name: blockchain
* Auther: Yao
* Date Created: 2019-09-04
*/


const {
          Decimal,
          Datetime,
      } = require("node-common-sdk").util;


class BlockApiView {
    /**
     *
     * @param request
     * @param row
     * @returns {{chain, fast: string, fastest: string, maxPriorityFee: string, updateTime: string, source, status}}
     */
    static queryGasPrice(request, row) {
        return {
            chain:          row.chain,
            fastest:        Decimal.fromString(row.fastest).toString(10),
            fast:           Decimal.fromString(row.fast).toString(10),
            maxPriorityFee: Decimal.fromString(row.maxPriorityFee).toString(10),
            source:         row.source,
            status:         row.status,
            updateTime:     Datetime.fromString1(row.updateTime).mysql,
        };
    }

    static queryEvent(request, row) {
        return {
            id:          row.id,
            chain:       row.chain,
            address:     row.address,
            blockHash:   row.blockHash,
            blockNumber: row.blockNumber,
            version:     row.version,
            txHash:      row.txHash,
            txIndex:     row.txIndex,
            logIndex:    row.logIndex,
            event:       row.event,
            args:        row.args,
            status:      row.status,
        };
    }

    static queryEventList(request, result) {
        const list = [];
        for (let row of result.rows) {
            list.push(this.queryEvent(request, row));
        }

        return {
            page:  request.query.page,
            limit: request.query.limit,
            total: result.count,
            list,
        };
    }

}


module.exports = {
    BlockApiView,
};
