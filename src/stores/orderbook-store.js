import { Store } from 'consus-core/flux';
import clone from 'consus-core/clone';

class OrderbookStore extends Store {

}

const store = new OrderbookStore();

store.registerHandler('NEW_BID', data => {
    // TODO
});

export default store;
