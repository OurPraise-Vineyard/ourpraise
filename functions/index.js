const { initializeApp } = require('firebase-admin/app')

initializeApp()

const api = require('./endpoints/api')
const backup = require('./backup')

exports.api = api.app
exports.backup = backup
