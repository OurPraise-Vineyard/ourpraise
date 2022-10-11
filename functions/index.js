const { initializeApp } = require('firebase-admin/app')

initializeApp()

const triggers = require('./triggers')
const integrations = require('./endpoints/integrations')
const pdf = require('./endpoints/pdf')

exports.triggers = triggers
exports.events = integrations.events
exports.slides = integrations.slides
exports.pdf = pdf.pdf
