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
    try {
        Dispatcher.handleAction(action.type, action.data);
        let actionId = action.data.actionId;
        if (promises.has(actionId)) {
            promises.get(actionId).resolve(actionId);
            promises.delete(actionId);
        }
    } catch(e) {
        let actionId = action.data.actionId;
        if (promises.has(actionId)) {
            promises.get(actionId).reject(e);
            promises.delete(actionId);
        }
    }
});

export function publish(type, data) {
    data.actionId = crypto.randomBytes(32).toString('hex');
    data.timestamp = Math.floor(Date.now() / 1000);
    return new Promise((resolve, reject) => {
        promises.set(data.actionId, {
            resolve,
            reject
        });
        rack.publish({
            type,
            data
        });
    });
}
