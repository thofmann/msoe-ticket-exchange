import { Store } from 'consus-core/flux';
import clone from 'consus-core/clone';

let myTransactions = [];

class TransactionStore extends Store {

    getMyTransactions() {
        return clone(myTransactions);
    }

}

const store = new TransactionStore();

store.registerHandler('UPDATE_MY_TRANSACTIONS', data => {
    myTransactions = data.myTransactions;
    store.emitChange();
});

export default store;
