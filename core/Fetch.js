import { BASE_URL } from './constants'

let Fetch = {};

Fetch.get = function(url, successCallback, errorCallback) {
    fetch(BASE_URL + url)
        .then(function(response) {
            response.json().then(function(value) {
                successCallback(value);
            });
        }).catch(function(error) {
            errorCallback(error);
        });
};


module.exports = Fetch;
