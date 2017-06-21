const csv = require("fast-csv");
const Promise = require("bluebird");
const mappers = require("./mappers/index");
const exchanges = Object.keys(mappers);

const defaultOpts = {
  headers: true,
  strictColumnHandling: true,
  ignoreEmpty: true
};

class Parser {
  constructor(exchange) {
    this.exchange = exchange;
  }

  fromStream(stream, csvOptions) {
    let opts = Object.assign(defaultOpts, csvOptions);
    return _process(stream.pipe(csv(opts)));
  }

  fromPath(pathString) {
    let opts = Object.assign(defaultOpts, csvOptions);
    return _process(csv.fromPath(pathString, opts));

  }

  fromString(string) {
    let opts = Object.assign(defaultOpts, csvOptions);
    return _process(csv.fromPath(string, opts));
  }

  _process(csvStream) {
    if (!exchanges.includes(this.exchange))
      return Promise.reject("Invalid exchange");

    return new Promise((resolve, reject) => {
      var parsedData = [];
      csvStream.on("data", (data) => {
          parsedData.push(data);
        })
        .on("end", () => {
          let mappedData = mappers[this.exchange](parsedData);
          return resolve(mappedData);
        })
        .on("data-invalid", (data) => {
          return reject("Malformed File");
        });
    });
  }
}

module.exports = Parser;
