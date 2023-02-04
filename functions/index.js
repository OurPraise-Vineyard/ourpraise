const { initializeApp } = require('firebase-admin/app')

initializeApp()

const triggers = require('./triggers')
const api = require('./endpoints/api')
const pdf = require('./endpoints/pdf')
const backup = require('./backup')

exports.triggers = triggers
exports.api = api.app
exports.pdf = pdf.pdf
exports.backup = backup
