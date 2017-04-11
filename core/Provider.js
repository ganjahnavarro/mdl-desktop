import Fetch from './fetch'

let Provider = {};

Provider.loadAgents = function(callback) {
    let parameters = {
        orderedBy: "name"
    };

    Fetch.get("agent/", parameters, (items) => {
        if (callback) {
            callback(items);
        }
    });
};

Provider.loadUnits = function(callback) {
    let parameters = {
        orderedBy: "name"
    };

    Fetch.get("unit/", parameters, (items) => {
        if (callback) {
            callback(items);
        }
    });
};

Provider.loadCategories = function(callback) {
    let parameters = {
        orderedBy: "name"
    };

    Fetch.get("category/", parameters, (items) => {
        if (callback) {
            callback(items);
        }
    });
};

module.exports = Provider;
