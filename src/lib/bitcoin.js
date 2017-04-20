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
