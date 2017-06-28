const moment = require("moment");

module.exports = (raw) => {
  return raw.map((obj) => {
    let [fromCurrency, toCurrency] = obj.Market.split('/');
    let feePercentage = parseFloat(obj.Fee.slice(0, -1));
    let rate = parseFloat(obj.Price);
    let boughtAmount = parseFloat(obj['Base Total Less Fee']);
    let feeToCurrency = parseFloat(obj.Total) - boughtAmount;
    let feeFromCurrency = feeToCurrency / rate;
    return {
      bookID: obj['Order Number'],
      fee: {
        percentage: feePercentage,
        absolute: {
          [fromCurrency]: feeFromCurrency, [toCurrency]: feeToCurrency
        }
      },
      sold: {
        currency: fromCurrency,
        valueGross: parseFloat(obj.Amount) //Gross value
      },
      bought: {
        currency: toCurrency,
        valueNet: boughtAmount // NET value
      },
      rate,
      date: moment.utc(obj.Date),
      exchange: 'poloniex'
    }
  })
}
