import Fetch from './fetch'

let Provider = {
    filteredItems: {}
};

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

Provider.loadSuppliers = function(callback) {
    let parameters = {
        orderedBy: "name"
    };

    Fetch.get("supplier/", parameters, (items) => {
        if (callback) {
            callback(items);
        }
    });
};

Provider.loadStocks = function(callback) {
    let parameters = {
        orderedBy: "name"
    };

    Fetch.get("stock/", parameters, (items) => {
        if (callback) {
            callback(items);
        }
    });
};

Provider.loadBrands = function(callback) {
    let parameters = {
        orderedBy: "name"
    };

    Fetch.get("brand/", parameters, (items) => {
        if (callback) {
            callback(items);
        }
    });
};

Provider.loadCustomers = function(callback) {
    let parameters = {
        orderedBy: "name"
    };

    Fetch.get("customer/", parameters, (items) => {
        if (callback) {
            callback(items);
        }
    });
};

module.exports = Provider;
