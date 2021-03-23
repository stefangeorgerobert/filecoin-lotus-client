'use strict';

const { LotusMethods } = require('./methods')
const axios = require('axios');
const Queue = require('promise-queue');

class Lotus {
    constructor(api, token, maxPendingPromises = 100) {
        this.id = 0
        this.api = api;
        this.token = token;
        this.queue = new Queue(maxPendingPromises, Infinity);
    }

    async LotusAPI(method, params, timeout = 60000) {
        let body = JSON.stringify({
            "jsonrpc": "2.0",
            "method": `Filecoin.${method}`,
            "params": params,
            "id": this.id++,
        });

        if (!LotusMethods[method]) {
            console.error(`Filecoin.${method} not found`);
            return undefined;
        }

        const response = await axios.post(this.api, body, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            },
            timeout: timeout
        });

        return response?.data;
    }

    StateListMiners() {
        return this.queue.add(() => {
            return this.LotusAPI("StateListMiners", [null]);
        });
    }

    StateMinerPower(miner) {
        return this.queue.add(() => {
            return this.LotusAPI("StateMinerPower", [miner, null]);
        });
    }

    ClientMinerQueryOffer(miner, dataCid, timeout = 180000) {
        return this.queue.add(() => {
            return this.LotusAPI("ClientMinerQueryOffer", [miner, { "/": dataCid }, null], timeout);
        });
    }

    ClientRetrieve(retrievalOffer, outFile, timeout = 180000) {
        return this.queue.add(() => {
            return this.LotusAPI("ClientRetrieve", [retrievalOffer, { "Path": outFile, "IsCAR": false }], timeout);
        });
    }

    WalletDefaultAddress() {
        return this.queue.add(() => {
            return this.LotusAPI("WalletDefaultAddress", []);
        });
    }

    WalletBalance(wallet) {
        return this.queue.add(() => {
            return this.LotusAPI("WalletBalance", [wallet]);
        });
    }

    Version() {
        return this.queue.add(() => {
            return this.LotusAPI("Version", []);
        });
    }

    StateMinerInfo(miner) {
        return this.queue.add(() => {
            return this.LotusAPI("StateMinerInfo", [miner, null]);
        });
    }

    ClientQueryAsk(peerId, miner, timeout = 300000) {
        return this.queue.add(() => {
            return this.LotusAPI("ClientQueryAsk", [peerId, miner], timeout);
        });
    }

    ClientStartDeal(dataRef, timeout = 180000) {
        return this.queue.add(() => {
            return this.LotusAPI("ClientStartDeal", [dataRef], timeout);
        });
    }

    NetFindPeer(peerId) {
        return this.queue.add(() => {
            return this.LotusAPI("NetFindPeer", [peerId]);
        });
    }

    StateGetActor(miner, tipSetKey) {
        return this.queue.add(() => {
            return this.LotusAPI("StateGetActor", [miner, tipSetKey]);
        });
    }

    ChainGetTipSetByHeight(chainEpoch, tipSetKey) {
        return this.queue.add(() => {
            return this.LotusAPI("ChainGetTipSetByHeight", [chainEpoch, tipSetKey]);
        });
    }

    ChainGetParentMessages(blockCid, timeout = 180000) {
        return this.queue.add(() => {
            return this.LotusAPI("ChainGetParentMessages", [blockCid], timeout);
        });
    }

    ChainGetParentReceipts(blockCid, timeout = 180000) {
        return this.queue.add(() => {
            return this.LotusAPI("ChainGetParentReceipts", [blockCid], timeout);
        });
    }

    ChainHead() {
        return this.queue.add(() => {
            return this.LotusAPI("ChainHead", []);
        });
    }

    StateMarketStorageDeal(dealID, tipSetKey, timeout = 180000) {
        return this.queue.add(() => {
            return this.LotusAPI("StateMarketStorageDeal", [dealID, tipSetKey], timeout);
        });
    }

    StateMarketDeals(tipSetKey, timeout = 180000) {
        return this.queue.add(() => {
            return this.LotusAPI("StateMarketDeals", [tipSetKey], timeout);
        });
    }

    StateSectorGetInfo(miner, sector, tipSetKey, timeout = 180000) {
        return this.queue.add(() => {
            return this.LotusAPI("StateSectorGetInfo", [miner, sector, tipSetKey], timeout);
        });
    }

    StateSectorExpiration(miner, sector, tipSetKey) {
        return this.queue.add(() => {
            return this.LotusAPI("StateSectorExpiration", [miner, sector, tipSetKey]);
        });
    }

    ClientGetDealInfo(dealCid) {
        return this.queue.add(() => {
            return this.LotusAPI("ClientGetDealInfo", [{ "/": dealCid }]);
        });
    }

}

module.exports = {
    Lotus
};