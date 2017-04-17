import crypto from 'crypto';
import path from 'path';
import { Dispatcher } from 'consus-core/flux';
import Oak from 'oak-lite';

const database = Oak.configure({
    dataDirectory: path.join(__dirname, '../../')
});

const rack = database.selectRack('actions');

const promises = new Map();

rack.subscribe(action => {
    Dispatcher.handleAction(action.type, action.data);
    let actionId = action.data.actionId;
    if (promises.has(actionId)) {
        promises.get(actionId)(actionId);
        promises.delete(actionId);
    }
});

export function publish(type, data) {
    data.actionId = crypto.randomBytes(32).toString('hex');
    data.timestamp = Math.floor(Date.now() / 1000);
    return new Promise(resolve => {
        promises.set(data.actionId, resolve);
        rack.publish({
            type,
            data
        });
    });
}
