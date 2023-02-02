import { toString, fromString  } from 'uint8arrays';

export const JSONToBase64url = (object: any) => {
    return toString(fromString(JSON.stringify(object)), 'base64url');
}
export const base64urlToJSON = (s: string) => {
    return JSON.parse(toString(fromString(s, 'base64url')));
}

export const StringToBase64url = (string: string) => {
    return toString(fromString(string), 'base64url');
}

export const base64urlToString = (s: string) => {
    return toString(fromString(s, 'base64url'));
}