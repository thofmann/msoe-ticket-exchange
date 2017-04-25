import { Store } from 'consus-core/flux';
import clone from 'consus-core/clone';

let bids = [];
let asks = [];
let myBids = [];
let myAsks = [];

class OrderBookStore extends Store {

    getBids() {
        return clone(bids);
    }

    getAsks() {
        return clone(asks);
    }

    getMyBids() {
        return clone(myBids);
    }

    getMyAsks() {
        return clone(myAsks);
    }

}

const store = new OrderBookStore();

store.registerHandler('UPDATE_BIDS', data => {
    bids = data.bids;
    store.emitChange();
});

store.registerHandler('UPDATE_ASKS', data => {
    asks = data.asks;
    store.emitChange();
});

store.registerHandler('UPDATE_MY_BIDS', data => {
    myBids = data.myBids;
    store.emitChange();
});

store.registerHandler('UPDATE_MY_ASKS', data => {
    myAsks = data.myAsks;
    store.emitChange();
});

export default store;
