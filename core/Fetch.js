import Store from 'store'
import { Base64 } from 'js-base64'

import { BASE_URL } from './constants'
import Alert from './alert'

let Fetch = {};

Fetch.get = function(resource, urlParameters, successCallback, errorCallback) {
    let url = BASE_URL + resource + parseQuery(urlParameters);

    fetch(url, getDefaultHeaders())
        .then((response) => handleSuccess(successCallback, response))
        .catch((error) => handleError(errorCallback, error));
};

Fetch.post = function(resource, requestBody, successCallback, errorCallback) {
    let headers = Object.assign({}, getDefaultHeaders(), {
        method: "POST",
        body: JSON.stringify(requestBody)
    });

    fetch(BASE_URL + resource, headers)
        .then((response) => handleSuccess(successCallback, response))
        .catch((error) => handleError(errorCallback, error));
}

Fetch.delete = function(resource, id, successCallback, errorCallback) {
    let url = BASE_URL + resource + id;
    let headers = Object.assign({}, getDefaultHeaders(), {
        method: "DELETE"
    });

    fetch(url, headers)
        .then((response) => handleSuccess(successCallback, response))
        .catch((error) => handleError(errorCallback, error));
}

function getDefaultHeaders() {
    let headers = new Headers();
    headers.append("Accept", "application/json, text/plain, */*");
    headers.append("Content-Type", "application/json; charset=UTF-8");
    headers.append("Authentication", getAuthenticationHeader());

    return {
        headers
    };
}

function getAuthenticationHeader(headers) {
    let username = Store.get("username");
    let password = Store.get("password");
    return "Basic " + Base64.encode(username + ":" + password);
}

function handleSuccess(successCallback, response) {
    if (response && successCallback) {
        response.json().then(function(value) {
            successCallback(value);
        });
    }
}

function handleError(errorCallback, error) {
    let message = error.message || error;

    Alert.error(message);
    if (errorCallback) errorCallback(message);
}

function parseQuery(urlParameters) {
    if (urlParameters) {
        let queryArray = [];

        for (let key in urlParameters) {
            if (urlParameters.hasOwnProperty(key)) {
               queryArray.push(key + "=" + urlParameters[key]);
            }
        }
        return "?" + queryArray.join("&");
    }
    return "";
}

module.exports = Fetch;
