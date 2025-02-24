// process.env.NODE_ENVIRONMENT = 'production'

// require('dotenv').config({
//     path: process.env.NODE_ENVIRONMENT === 'production' ? '.production.env' : '.env',
// })


// console.log('aaa', process.env.aaa);
// console.log('bbb', process.env.bbb)

const yaml = require('js-yaml')
const fs = require('node:fs')

const config = fs.readFileSync('./hello.yaml')

console.log(yaml.load(config));