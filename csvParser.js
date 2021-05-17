const fs = require('fs');
const path = require('path');

const file = './CSVFile_2kb.csv';
const filePath = path.resolve(file);

// async function ReadFile() {
//   try {
//     const readStream = await fs.createReadStream(filePath, {
//       // encoding: 'UTF-8',
//       // highWaterMark: 16,
//     });

//     // return readStream;
//   } catch (err) {
//     console.log(error);
//   }
// }

const readStream = fs.createReadStream(filePath, {
  // encoding: 'UTF-8',
  // highWaterMark: 16,
});

const data = [];
let final = [];

/* Need to be changed on user input or by checking file with tab */
const delimiter = ',';

// console.log(readStream);

readStream.on('data', (chunk) => {
  // console.log('CHUCKS', chunk);

  let stripped = chunk.toString().replace(/(\r|\r\n)/g, '');
  // str = str.replace(/^\n+|\n+$/g, '');
  data.push(stripped);
});

const parser = (string) => {
  /* Trim empty lines */
  // string = string.replace(/^\n+|\n+$/g, '');
  let arrays = string.split('\n');
  arrays = arrays.filter((string) => {
    return string.length > 0;
  });

  // console.log(string);
  // console.log(arrays);

  arrays.forEach((string) => {
    final.push(string.split(delimiter));
  });
  console.log(final);
};

readStream.on('end', function () {
  // final = Buffer.concat(data).toString();
  // console.log(Buffer.concat(data).toString());
  // console.log(data);
  data.forEach((value, index) => {
    parser(value);
  });
  // final = data;
  // data = data.replace(/(\r|\r\n)/g, '');
});

// console.log(final);
