import { Store } from 'consus-core/flux';
improt clone from 'consus-core/clone';
import StudentStore from './student-store';

// descending bid price
let bids = [];

/*
1000
900
800
700
 */

// ascending ask price
let asks = [];

/*
1100
1200
1300
1400
1500
 */

function insertBid(price, quantity, studentEmail) {
    for (let i = 0; i <= bids.length; i++) {
        if (bids[i].price < price) {
            bids.splice(i, 0, {
                price,
                quantity,
                studentEmail
            });
        }
    }
}

class OrderbookStore extends Store {

    getBids(count = Infinity) {
        return clone(bids.slice(0, count));
    }

    getAsks(count = Infinity) {
        return clone(asks.slice(0, count));
    }

}

const store = new OrderbookStore();

store.registerHandler('NEW_BID', data => {
    store.waitFor(StudentStore);
    let remaining = data.quantity;
    while (remaining > 0) {
        if (asks[0].price <= data.price) {
            if (asks[0].quantity <= remaining) {
                remaining -= asks[0].quantity;
                asks.shift();
                // TODO: credit students
            } else {
                asks[0].quantity -= remaining;
                remaining = 0;
                // TODO: credit students
            }
        } else {
            insertBid(data.price, remaining, data.studentEmail);
        }
    }
});

export default store;
