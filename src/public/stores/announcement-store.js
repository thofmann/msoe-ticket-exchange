import { Store } from 'consus-core/flux';
import clone from 'consus-core/clone';

let announcements = [];

class OrderBookStore extends Store {

    getAnnouncements() {
        return clone(announcements);
    }

}

const store = new OrderBookStore();

store.registerHandler('NEW_ANNOUNCEMENT', data => {
    announcements.push(data.announcement);
    store.emitChange();
});

export default store;
