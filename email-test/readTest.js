const fs = require('node:fs')
const path = require('node:path')

const res = fs.readFileSync('./index.html')

console.log(res.toString())

const pathFile = path.join(__dirname, 'readTest', 'ssa' + '.html')
fs.writeFileSync(pathFile, 'ww')
fs.writeFileSync('./test.txt', 'wwwwwww')
