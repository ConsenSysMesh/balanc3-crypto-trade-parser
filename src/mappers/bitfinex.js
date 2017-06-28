const moment = require("moment");

module.exports = (raw) => {
  return raw.map((obj) => {
    console.log(obj)

    let fromCurrency, toCurrency, boughtAmount, valueGross, valueNet;
    let rate = parseFloat(obj.Price);
    if (obj.Amount.slice(0, 1) == '-') {
      [fromCurrency, toCurrency] = obj.Pair.split('/');
      valueGross = parseFloat(obj.Amount.slice(1));
      valueNet = valueGross * rate;
    } else {
      [toCurrency, fromCurrency] = obj.Pair.split('/');
      valueNet = parseFloat(obj.Amount.slice(1));
      valueGross = valueNet * rate;
    }

    boughtAmount = parseFloat(obj['Base Total Less Fee']);

    return {
      bookID: obj['#'],
      sold: {
        currency: fromCurrency,
        valueGross
      },
      bought: {
        currency: toCurrency,
        valueNet
      },
      rate,
      date: moment.utc(obj.Date),
      exchange: 'bitfinex'
    }
  })
}
