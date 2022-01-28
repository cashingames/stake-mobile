import EStyleSheet from "react-native-extended-stylesheet";

export function isTrue(value) {
    return value != "" && value !== undefined && value !== null
}

export function formatCurrency(value) {
    return Number(value).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

export function formatNumber(value) {
    return Number(value).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

export function scalableRem(value) {
    return `${EStyleSheet.value(value)}rem`;
}

export function imageLink(value) {
    return value;
}

export function avatarLink(value) {
    return value;
}

export function apiUrl(value) {
    return value;
}