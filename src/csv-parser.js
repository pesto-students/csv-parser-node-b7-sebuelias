const fs = require('fs');
const path = require('path');
const { Transform } = require('stream');

function csvToJsonParse(
  contentToParse,
  options = { delimiter: ',', header: false, headerTransform: null },
) {
  /**
   * TODO: need to add test for filePath or CSV data
   * for now, assuming filePath
   */
  return csvToJsonParseFile(contentToParse, options);
}

function csvToJsonParseFile(fileToParse, options) {
  const filePath = path.resolve(fileToParse);
  const { delimiter, header, headerTransform } = options;
  // const data = [];
  let headerRow = [];
  let headerSet = false;
  const readStream = fs.createReadStream(filePath, {
    // encoding: 'UTF-8',
    // highWaterMark: 16,
  });

  const writeStream = new Transform();

  /**
   * ! Parse data as we read from stream and
   * on end handle finishing?
   */
  readStream.on('data', (chunk) => {
    // console.log('CHUCKS', chunk.toString());
    let strippedChunk = chunk.toString().replace(/(\r|\r\n)/g, '');
    let arrays = [];
    let lines = strippedChunk.split('\n');

    /* Stripping comments */
    for (let line of lines) {
      if (line.indexOf('#') !== -1) {
        line = line.slice(0, line.indexOf('#'));
      }
      arrays.push(line);
    }

    // let arrays = chunk.toString().split('\n');
    /**
     * TODO:  Trim empty lines
     */
    // string = string.replace(/^\n+|\n+$/g, '');
    arrays = arrays.filter((string) => {
      return string.length > 0;
    });

    arrays = arrays.map((row) => row.split(delimiter));

    /* If Header option is ON && 1st chunk */
    if (header && !headerSet) {
      headerSet = true;
      headerRow = arrays[0];

      if (headerTransform != null) {
        headerRow = headerTransform(headerRow);
      }
      /* remove 1st row after using it for header */
      arrays = arrays.slice(1);
    }
    /* if Header then, add header to row */
    if (header) {
      arrays = arrays.map((row) => {
        const rowWithHeader = {};
        row.forEach((element, index) => {
          const headerName = headerRow[index];
          rowWithHeader[headerName] = element;
        });
        return rowWithHeader;
      });
    }

    const stringifiedJSONObj = JSON.stringify(arrays);
    writeStream.push(stringifiedJSONObj);
    // data.push(arrays);
  });

  // readStream.on('close', () => {
  // console.log('writeStream');
  // console.log(writeStream);
  // });

  // readStream.on('end', function () {
  //   data.forEach((value, index) => {
  //     parser(value, options);
  //   });
  // });

  return writeStream;
}

function jsonToCsvParse(contentToParse, options = { delimiter: ',' }) {
  /**
   * TODO: need to add test for filePath or CSV data
   * for now, assuming filePath
   */
  return jsonToCsvParseFile(contentToParse, options);
}

function jsonToCsvParseFile(fileToParse, options) {
  const filePath = path.resolve(fileToParse);
  const { delimiter } = options;

  const readStream = fs.createReadStream(filePath);

  const writeStream = new Transform();

  readStream.on('data', (chunk) => {
    const chunkString = chunk.toString();
    const jsonData = JSON.parse(chunkString);

    //to handle null values
    const nullReplacer = (key, value) => (value === null ? '' : value);

    const header = Object.keys(jsonData[0]);

    const csv = [
      // header row first
      header.join(delimiter),
      // rest of the data iteratiing each entry
      ...jsonData.map((row) =>
        /**
         * using header here to iterate through that,
         * to get KEY to obtain the VALUE and
         * add DELIMITER in end of each value
         */
        header
          .map((fieldName) => JSON.stringify(row[fieldName], nullReplacer))
          .join(delimiter),
      ),
      // Add new line end of row
    ].join('\r\n');

    writeStream.push(csv);
    // console.log(csv);
  });

  return writeStream;
}

module.exports = {
  csvToJsonParse,
  jsonToCsvParse,
};
