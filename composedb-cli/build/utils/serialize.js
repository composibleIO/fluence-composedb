import { toString, fromString } from 'uint8arrays';
export const JSONToBase64url = (object) => {
    return toString(fromString(JSON.stringify(object)), 'base64url');
};
export const base64urlToJSON = (s) => {
    return JSON.parse(toString(fromString(s, 'base64url')));
};
