export function urlEncode(obj: object): string {

    let rtn = '';

    for (const key in obj) {

        if (obj.hasOwnProperty(key)) {
            if (rtn) {
                rtn += '&';
            }
            rtn += encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]);
        }
    }

    return rtn;
}

export function isEmptyObject(value): boolean {
    return Object.keys(value).length === 0 && value.constructor === Object;
}

export function isUndefinedOrEmptyObject(value): boolean {
    if (value === undefined || value === null) {
        return true;
    } else {
        return Object.keys(value).length === 0 && value.constructor === Object;
    }
}
