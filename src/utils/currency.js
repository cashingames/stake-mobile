export default currency = {
    format(value) {
        return Number(value).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }
}