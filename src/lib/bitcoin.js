import request from 'request';
import config from '../../config.json';

function call(endpoint, method, qs, json) {
    let options = {
        uri: `${config.bitcoin.bcoin.protocol}://${config.bitcoin.bcoin.host}:${config.bitcoin.bcoin.port}/${endpoint}`,
        method,
        auth: {
            user: 'x',
            pass: config.bitcoin.bcoin.key
        }
    };
    if (typeof qs !== 'undefined') {
        options.qs = qs;
    }
    if (typeof json !== 'undefined') {
        options.json = json;
    }
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (response.statusCode !== 200) {
                return reject(new Error('An unexpected error occurred.'));
            }
            if (typeof body === 'string') {
                body = JSON.parse(body);
            }
            resolve(body);
        });
    });
}

export function get(endpoint, data) {
    return call(endpoint, 'GET', data);
}

export function post(endpoint, data) {
    return call(endpoint, 'POST', undefined, data);
}

export function put(endpoint, data) {
    return call(endpoint, 'PUT', data);
}

function createWallet() {
    return get(`wallet/${config.bitcoin.bcoin.wallet}`).catch(e => {
        return put('wallet/working-watchtest', {
            type: 'pubkeyhash',
            watchOnly: true,
            accountKey: config.bitcoin.xpubkey
        });
    });
}

export function initialize() {
    return createWallet().then(() => {
        // TODO: Start listening for payments
    });
}

export function getPaymentAddress(callback) {
    // TODO: return a new payment address
    // TODO: call the `callback` when payments are received at this address
}
