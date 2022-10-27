const functions = require('firebase-functions')
const { getAuth } = require('firebase-admin/auth')
const { getFirestore, FieldValue } = require('firebase-admin/firestore')

const db = getFirestore()

exports.onWriteEvent = functions
  .region('europe-west1')
  .firestore.document('events/{eventId}')
  .onWrite(async change => {
    if (change.after.exists) {
      if (change.before.exists) {
        // Update
        const prevSongs = change.before.data().songs
        const nextSongs = change.after.data().songs

        const added = nextSongs.filter(
          ({ id: idA }) => prevSongs.findIndex(({ id: idB }) => idA === idB) === -1
        )
        const removed = prevSongs.filter(
          ({ id: idA }) => nextSongs.findIndex(({ id: idB }) => idA === idB) === -1
        )

        await Promise.all(
          added.map(song =>
            db.doc(`songs/${song.id}`).update({
              popularity: FieldValue.increment(1)
            })
          )
        )

        await Promise.all(
          removed.map(song =>
            db.doc(`songs/${song.id}`).update({
              popularity: FieldValue.increment(-1)
            })
          )
        )
      } else {
        // Create
        const songs = change.after.data().songs

        await Promise.all(
          songs.map(song =>
            db.doc(`songs/${song.id}`).update({
              popularity: FieldValue.increment(1)
            })
          )
        )
      }
    } else {
      // Delete
      const prevSongs = change.before.data().songs

      await Promise.all(
        prevSongs.map(song =>
          db.doc(`songs/${song.id}`).update({
            popularity: FieldValue.increment(-1)
          })
        )
      )
    }
  })

function handleAddedMembers(org, members) {
  const orgName = org.name
  return Promise.all(
    members.map(async member => {
      if (
        !(await getAuth()
          .getUserByEmail(member)
          .then(() => true)
          .catch(() => false))
      ) {
        await db.collection('mail').add({
          to: member,
          message: {
            subject: `Invitation to join ${orgName} on OurPraise`,
            html: `Hi 👋<br><br>You've been invited to join ${orgName} on OurPraise. Sign up today by using the link below:<br><a href="https://ourpraise.dk/register?email=${member}">Click here to register.</a><br><br>Best regards,<br>The OurPraise Team.`
          }
        })
      }

      await db.runTransaction(transaction =>
        transaction.get(db.doc(`users/${member}`)).then(doc => {
          let orgs = []
          if (doc.exists) {
            orgs = doc.data().organisations
          }

          orgs.push(org.id)

          transaction.set(doc.ref, { organisations: orgs }, { merge: true })
        })
      )
    })
  )
}

function handleRemovedMembers(org, members) {
  return Promise.all(
    members.map(async member => {
      await db.runTransaction(transaction =>
        transaction.get(db.doc(`users/${member}`)).then(doc => {
          if (doc.exists) {
            const orgs = doc.data().organisations

            orgs.splice(orgs.indexOf(org.id), 1)

            if (orgs.length === 0) {
              transaction.delete(doc.ref)
            } else {
              transaction.set(doc.ref, { organisations: orgs }, { merge: true })
            }
          }
        })
      )
    })
  )
}

exports.onUpdateOrganisation = functions
  .region('europe-west1')
  .firestore.document('organisations/{id}')
  .onUpdate(async change => {
    const addedMembers = change.after
      .data()
      .members.filter(member => change.before.data().members.indexOf(member) === -1)
    const removedMembers = change.before
      .data()
      .members.filter(member => change.after.data().members.indexOf(member) === -1)

    const org = {
      ...change.after.data(),
      id: change.after.id
    }

    if (addedMembers.length > 0) {
      await handleAddedMembers(org, addedMembers)
    }

    if (removedMembers.length > 0) {
      await handleRemovedMembers(org, removedMembers)
    }
  })

exports.onDeleteOrganisation = functions
  .region('europe-west1')
  .firestore.document('organisations/{id}')
  .onDelete(async before => {
    const org = {
      ...before.data(),
      id: before.id
    }
    await handleRemovedMembers(org, org.members)
  })

exports.onCreaterganisation = functions
  .region('europe-west1')
  .firestore.document('organisations/{id}')
  .onCreate(async after => {
    const org = {
      ...after.data(),
      id: after.id
    }
    await handleAddedMembers(org, org.members)
  })
