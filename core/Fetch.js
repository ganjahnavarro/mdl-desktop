import Store from 'store'
import { Base64 } from 'js-base64'

import { BASE_URL } from './constants'
import Alert from './alert'

let Fetch = {};

// $("#loadingPanel").removeClass("active");

Fetch.get = function(resource, urlParameters, successCallback, errorCallback) {
    preFetch();
    let url = BASE_URL + resource + parseQuery(urlParameters);

    fetch(url, getDefaultHeaders())
        .then((response) => handleResponse(successCallback, response))
        .catch((error) => handleError(errorCallback, error));
};

Fetch.post = function(resource, requestBody, successCallback, errorCallback) {
    preFetch();
    let headers = Object.assign({}, getDefaultHeaders(), {
        method: "POST",
        body: JSON.stringify(requestBody)
    });

    fetch(BASE_URL + resource, headers)
        .then((response) => handleResponse(successCallback, response))
        .catch((error) => handleError(errorCallback, error));
}

Fetch.patch = function(resource, requestBody, successCallback, errorCallback) {
    preFetch();
    let headers = Object.assign({}, getDefaultHeaders(), {
        method: "PATCH",
        body: JSON.stringify(requestBody)
    });

    fetch(BASE_URL + resource, headers)
        .then((response) => handleResponse(successCallback, response))
        .catch((error) => handleError(errorCallback, error));
}

Fetch.delete = function(resource, id, successCallback, errorCallback) {
    preFetch();
    let url = BASE_URL + resource + id;
    let headers = Object.assign({}, getDefaultHeaders(), {
        method: "DELETE"
    });

    fetch(url, headers)
        .then((response) => successCallback())
        .catch((error) => handleError(errorCallback, error));
}

function preFetch() {
    $("#loadingPanel").addClass("active");
}

function postFetch() {
    $("#loadingPanel").removeClass("active");
}

function getDefaultHeaders() {
    let headers = new Headers();
    headers.append("Accept", "application/json, text/plain, */*");
    headers.append("Content-Type", "application/json; charset=UTF-8");
    return { headers };
}

function handleResponse(callback, response) {
    response.ok ? handleSuccess(callback, response) : handleError(callback, response);
    postFetch();
}

function handleSuccess(successCallback, response) {
    if (response && successCallback) {
        response.text().then((text) => {
            try {
                let value = JSON.parse(text);
                successCallback(value);
            } catch(err) {
                successCallback(null);
            }
        });
    }
}

function handleError(errorCallback, response) {
    if (response) {
        response.json().then((error) => {
            let message = error.message || error;
            Alert.error(message);
            if (errorCallback) errorCallback(message);
        });
    }
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
