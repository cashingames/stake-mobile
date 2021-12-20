
export function isTrue(value) {
    return value != "" && value !== undefined && value !== null
}

export function formatCurrency(value) {
    return Number(value).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}