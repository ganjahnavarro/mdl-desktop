import Fetch from './fetch';
import { SERVER_URL, VIEWER_PATH, PDFS_DIRECTORY } from './constants';

let Utils = {};

Utils.isEmpty = (obj) => Object.keys(obj).length === 0 && obj.constructor === Object;

Utils.getPDFPath = (fileName) => {
    const encodedFileName = encodeURIComponent(PDFS_DIRECTORY + fileName);
    return SERVER_URL + VIEWER_PATH + encodedFileName;
};

let preview = null;

Utils.open = (fileName) => {
    if (preview != null) {
        preview.close();
    }
    const params = ["height=" + screen.availHeight, "width=" + screen.availWidth].join(',');
    preview = window.open(Utils.getPDFPath(fileName), 'popup_window', params);
};

Utils.print = (type, requestData) => {
    Fetch.post(`reports/${type}`, requestData, (fileName) => {
        Utils.open(fileName);
    });
};

module.exports = Utils;
