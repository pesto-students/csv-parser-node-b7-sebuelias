const fs = require('fs');
const path = require('path');
let final = [];

function csvParse(contentToParse, options = { delimiter: ',', header: false }) {
  /**
   * TODO: need to add test for filePath or CSV data
   * for now, assuming filePath
   */
  return csvParseFile(contentToParse, options);
}

function csvParseFile(
  fileToParse,
  options = { delimiter: ',', header: false },
) {
  const filePath = path.resolve(fileToParse);
  const { delimiter, header } = options;
  const data = [];
  let headerRow = [];
  let headerSet = false;
  const readStream = fs.createReadStream(filePath, {
    // encoding: 'UTF-8',
    // highWaterMark: 16,
  });

  /**
   * ! Parse data as we read from stream and
   * on end handle finishing?
   */
  readStream.on('data', (chunk) => {
    // console.log('CHUCKS', chunk);
    let strippedChunk = chunk.toString().replace(/(\r|\r\n)/g, '');

    let arrays = strippedChunk.split('\n');
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

    // console.log(arrays);
    data.push(arrays);
  });

  // readStream.on('end', function () {
  //   data.forEach((value, index) => {
  //     parser(value, options);
  //   });
  // });

  // console.log('final in main');
  // console.log(final);
  return final;
}

module.exports = {
  csvParse,
};
