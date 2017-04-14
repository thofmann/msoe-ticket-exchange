import { Store } from 'consus-core/flux';
import clone from 'consus-core/clone';

let bids = [];
let asks = [];

class OrderBookStore extends Store {

    getBids() {
        return clone(bids);
    }

    getAsks() {
        return clone(asks);
    }

}

const store = new OrderBookStore();

store.registerHandler('UPDATE_BIDS', data => {
    bids = data.bids;
});

store.registerHandler('UPDATE_ASKS', data => {
    asks = data.asks;
});

export default store;
