const moment = require("moment");

module.exports = (raw) => {
  return raw.map((obj) => {
    return {
      date: moment(obj.Date),
      value: obj['Base Total Less Fee']
    }
  })
}
