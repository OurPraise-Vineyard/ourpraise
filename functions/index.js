const { initializeApp } = require('firebase-admin/app')

initializeApp()

const api = require('./endpoints/api')

exports.api = api.app
