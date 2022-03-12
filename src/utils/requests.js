import { getCookie } from './utils';

/**
 * Sends http request with JSON data to a specified url
 *
 * @param {string} method method to use: GET/POST/PUT/DELETE
 * @param {string} url url to which the request will be sent
 * @param {object} data post/put/delete dict, that will be JSONed
 * @returns {Promise<object>} returns fetch's response
 */
export async function request(method, url, data = {}) {
    let params = {};
    if (!['GET', 'HEAD'].includes(method) && data) {
        params = {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': getCookie('_csrf')
            },
            body: JSON.stringify(data)
        };
    }

    return fetch(url, {
        method: method,
        mode: 'cors',
        credentials: 'include',
        ...params
    });
}

function toArgs(data) {
    return Object.keys(data).map(key =>
        encodeURIComponent(key) + '=' + encodeURIComponent(data[key])
    ).join('&');
}

export default class ApiRequest {
    apiUrl = undefined;

    constructor(apiUrl) {
        this.apiUrl = apiUrl;
    }

    request(method, path, data = {}) {
        return request(method, this.apiUrl + path, data);
    }

    get(path, data = {}) {
        return this.request('GET', path/* + '?' + toArgs(data)*/, {});
    }
    post(path, data = {}) {
        return this.request('POST', path, data);
    }
    put(path, data = {}) {
        return this.request('PUT', path, data);
    }
    delete(path, data = {}) {
        return this.request('DELETE', path, data);
    }
}
