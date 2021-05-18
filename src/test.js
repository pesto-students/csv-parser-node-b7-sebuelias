const { csvParse } = require('./csv-parser');

const filePath = '../test_data/CSVFile_2kb.csv';
const option = { header: false, delimiter: ',' };

const result = csvParse(filePath, option);

console.log('result');
console.log(result);
