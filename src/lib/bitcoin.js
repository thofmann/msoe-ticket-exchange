import request from 'request';
import bitcore from 'bitcore-lib';
import { publish } from './database';
import ExchangeStore from '../stores/exchange-store';
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
    return call(endpoint, 'PUT', undefined, data);
}

function createWallet() {
    return get(`wallet/${config.bitcoin.bcoin.account}`).catch(() => {
        return put(`wallet/${config.bitcoin.bcoin.account}`, {
            type: 'pubkeyhash',
            watchOnly: true,
            accountKey: config.bitcoin.xpubkey
        });
    });
}

function getPayments() {
    return get(`wallet/${config.bitcoin.bcoin.account}/tx/history`).then(data => {
        return data.reduce((transactions, tx) => {
            if (tx.confirmations < 6) {
                return transactions;
            }
            return transactions.concat(tx.outputs.filter(o => o.path !== null && o.path.account === 0 && o.path.change === false).map(output => {
                return {
                    txid: tx.hash,
                    satoshis: parseInt(parseFloat(output.value) * 100 * 1000 * 1000),
                    address: output.address,
                    studentId: parseInt(output.path.derivation.split('/').pop())
                };
            }));
        }, []);
    });
}

function updatePayments() {
    return getPayments().then(payments => {
        if (ExchangeStore.getPayments().length < payments.length) {
            publish('UPDATE_PAYMENTS', {
                payments
            });
        }
    });
}

createWallet().then(() => {
    // Check for deposits every 60 seconds
    updatePayments();
    setInterval(updatePayments, 60 * 1000);
});

export function studentIdToBitcoinAddress(studentId) {
    return bitcore.HDPublicKey.fromString(config.bitcoin.xpubkey).derive(`m/0/${studentId}`).publicKey.toAddress().toString();
}
