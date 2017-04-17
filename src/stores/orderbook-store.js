import { Store } from 'consus-core/flux';

class OrderbookStore extends Store {

}

const store = new OrderbookStore();

store.registerHandler('NEW_BID', () => {
    // TODO
});

export default store;
