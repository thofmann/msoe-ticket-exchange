import { Store } from 'consus-core/flux';

let studentsRegistered;
let ticketsExchanged;
let lastPrice;

class StatsStore extends Store {

    getStudentsRegistered() {
        return studentsRegistered;
    }

    getTicketsExchanged() {
        return ticketsExchanged;
    }

    getLastPrice() {
        return lastPrice;
    }

}

const store = new StatsStore();

store.registerHandler('UPDATE_STUDENTS_REGISTERED', data => {
    studentsRegistered = data.studentsRegistered;
});

store.registerHandler('UPDATE_TICKETS_EXCHANGED', data => {
    ticketsExchanged = data.ticketsExchanged;
});

store.registerHandler('UPDATE_LAST_PRICE', data => {
    lastPrice = data.lastPrice;
});

export default store;
