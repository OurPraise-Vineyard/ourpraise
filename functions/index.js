const { initializeApp } = require('firebase-admin/app')

initializeApp()

const api = require('./endpoints/api')
const pdf = require('./endpoints/pdf')
const backup = require('./backup')

exports.api = api.app
exports.pdf = pdf.pdf
exports.backup = backup
