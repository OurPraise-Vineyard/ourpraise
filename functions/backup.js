const functions = require('firebase-functions')
const firestore = require('@google-cloud/firestore')
const client = new firestore.v1.FirestoreAdminClient()

exports.scheduledFirestoreExport = functions
  .region('europe-west1')
  .pubsub.schedule('0 0 * * *')
  .onRun(context => {
    const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT
    const databaseName = client.databasePath(projectId, '(default)')

    return client
      .exportDocuments({
        name: databaseName,
        outputUriPrefix: `gs://ourpraise-backup/firestore/${new Date().toISOString()}`,
        // Leave collectionIds empty to export all collections
        // or set to a list of collection IDs to export,
        // collectionIds: ['users', 'posts']
        collectionIds: []
      })
      .then(responses => {
        const response = responses[0]
        console.log(`Backup Operation: ${response['name']}`)
      })
      .catch(err => {
        console.error(err)
        throw new Error('Backup operation failed')
      })
  })
