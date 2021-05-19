const { csvToJsonParse, jsonToCsvParse } = require('./csv-parser');

/* -----------------------------------------csvToJsonParse------------------------------- */
const testCSVtoJSON = () => {
  console.log('------------------csvToJsonParse------------------');
  const csvFilePath = '../test_data/simpleHeaderTest.csv';
  const csvOption = {
    header: true,
    delimiter: ',',
    /*  headerTransform: (header) => header.map((column) => column.toUpperCase()), */
  };

  const csvResult = csvToJsonParse(csvFilePath, csvOption);

  console.log('result--JSON');
  csvResult.on('data', (chunk) => {
    console.log(chunk.toString());
  });
};

/* -----------------------------------------jsonToCsvParse------------------------------- */
const testJSONtoCSV = () => {
  console.log('------------------jsonToCsvParse------------------');
  const jsonFilePath = '../test_data/simpleJson.json';
  const jsonOption = {
    delimiter: ',',
  };

  const jsonResult = jsonToCsvParse(jsonFilePath, jsonOption);

  console.log('result---CSV');
  jsonResult.on('data', (chunk) => {
    console.log(chunk.toString());
  });
};

let CSVtoJSON = true;
let JSONtoCSV = false;

if (CSVtoJSON) {
  testCSVtoJSON();
}
if (JSONtoCSV) {
  testJSONtoCSV();
}
