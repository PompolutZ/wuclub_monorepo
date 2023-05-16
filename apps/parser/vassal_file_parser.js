const fs = require('fs');
const path = require('path');


const [,,fileName] = process.argv;
const tsvFile = fs.readFileSync(path.join(__dirname, fileName), 'utf8');

console.log(JSON.stringify(tsvFile));