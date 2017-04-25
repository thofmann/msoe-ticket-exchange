import { Store } from 'consus-core/flux';

let tickets;
let satoshis;

class WalletStore extends Store {

    getTickets() {
        return tickets;
    }

    getSatoshis() {
        return satoshis;
    }

}

const store = new WalletStore();

store.registerHandler('UPDATE_TICKETS', data => {
    tickets = data.tickets;
    console.log('emitting ticket change');
    store.emitChange();
});

store.registerHandler('UPDATE_SATOSHIS', data => {
    satoshis = data.satoshis;
    store.emitChange();
});

export default store;
