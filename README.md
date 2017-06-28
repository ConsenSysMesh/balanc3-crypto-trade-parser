# crypto-trade-parser

Easy trade history parser for several exchanges' CSV exports. It uses [Fast-csv](https://github.com/C2FO/fast-csv) lib to serialize the csv file and custom mappers to unify the trade entry format.

## Installation

`npm install crypto-trade-parser`

## Usage

  All main methods from *Fast-csv* were translated into:

  * `fromStream(stream, csvOptions)`
  * `fromPath(pathString, csvOptions)`
  * `fromString(string, csvOptions)`

  **csvOptions** is the *Fast-csv* lib's *option*, refer to its documentation.

  **Default options**:

  ```
  {
    headers: true,
    strictColumnHandling: true,
    ignoreEmpty: true
  }
  ```

  To keep a unified interface, all operations were promisefied.

  **data-invalid** events will reject the promise and its content will be passed over for error handling purposes.

  No **data** event is pushed, being suppressed until **end** event, which will resolve all content as a list of entries.

  ### Example

  ```
  var exchange = 'poloniex';
  var parser = new Parser(exchange);
  parser.fromPath('./myFile.csv').then((list)=>{
      console.log("Parsing is complete, there are " + list.length + " entries".)
  }).catch((failedRow)=>{
      console.error("Validation failed on:", failedRow);
  });
  ```

## Output

The execution product is a list of entries representing the trade. As information availability differ on exchanges, some fields may be unavailable, so do check for existence or inspect the code. (@Todo: table with propersties per exchange).

A entry has the following format:

```
{
  "exchange": "poloniex",
  "bookID": "1074456646",
  "rate": 1.064,
  "date": "2016-11-04T09:58:54.000Z"
  "fee": {
    "percentage": 0.15,
    "absolute": {
      "ETC": 0.000015009398496241134,
      "BTC": 0.000015970000000000567
    }
  },
  "sold": {
    "currency": "ETC",
    "valueGross": 0.01000911
  },
  "bought": {
    "currency": "BTC",
    "valueNet": 0.01063372
  }
}
```

* `exchange`: [**string**] the exchange name/source.
*  `bookID`: [**string**] is the order number/ID on the exchange's book. No transformation is applied.
* `rate`: [**float**] is the rate used/multiplied on the *sold* currency to result on the *bought* currency.
* `date`: [**moment.utc**] is the datetime in UTC timezone with the best precision ofered from the source.
* `fee`: [**Object**] has the properties related to the fee
	* `percentage`: [**float**] is the rate applied over **Gross** values to find total fee
	*  `absolute`: [**Object**] has the [**float**] values of calculated fee. The keys for this object are infered from the CSV file.
* `sold`: [**Object**]
    * `exchange`: [**string**] currency being sold.
    * `valueGross`: [**float**] Total/Gross value being liquidated from funds on the operation.
* `bought`: [**Object**]
    * `exchange`: [**string**] currency being bought.
    * `valueNet`: [**float**] Total/Net value being added to funds on the operation.
