import request from 'request';

function call(endpoint, method, qs, json) {
    let options = {
        uri: `${location.protocol}//${location.hostname}/api/${endpoint}`,
        method
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
            if (body.success) {
                resolve(body.data);
            } else {
                reject(new Error(body.message));
            }
        });
    });
}

export function post(endpoint, data) {
    return call(endpoint, 'POST', undefined, data);
}
