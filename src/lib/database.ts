import {
  DocumentData,
  QuerySnapshot,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  runTransaction,
  setDoc
} from 'firebase/firestore'

import { BackendError } from './firebase'

function mapDocId(doc: DocumentData): IDoc {
  return {
    ...doc.data(),
    id: doc.id
  }
}

function mapDocsId(snap: QuerySnapshot<DocumentData>): ICollection {
  return snap.docs.map(doc => ({ ...doc.data(), id: doc.id }))
}

export async function getCollection({
  path: collectionPath,
  orderBy: orderByField,
  sortDirection
}: ICollectionQuery): Promise<ICollection> {
  try {
    if (orderByField && sortDirection) {
      return getDocs(
        query(
          collection(getFirestore(), collectionPath),
          orderBy(orderByField, sortDirection)
        )
      ).then(docs => mapDocsId(docs))
    }
    return getDocs(query(collection(getFirestore(), collectionPath))).then(
      docs => mapDocsId(docs)
    )
  } catch (err) {
    throw new BackendError(err as string)
  }
}

export async function getDocument(path: string): Promise<IDoc> {
  let result
  try {
    result = await getDoc(doc(getFirestore(), path))
  } catch (err) {
    throw new BackendError(err as string)
  }

  if (result.exists()) {
    return mapDocId(result)
  }

  throw new BackendError(`Document "${path}" does not exist.`)
}

export async function createDocument(path: string, value: IDoc) {
  try {
    return addDoc(collection(getFirestore(), path), value)
  } catch (err) {
    throw new BackendError(err as string)
  }
}

export async function updateDocument(
  path: string,
  value: IDoc,
  options?: { merge?: boolean }
): Promise<void> {
  try {
    if (options) {
      return setDoc(doc(getFirestore(), path), value, options)
    }
    return setDoc(doc(getFirestore(), path), value)
  } catch (err) {
    throw new BackendError(err as string)
  }
}

export async function deleteDocument(path: string) {
  try {
    return deleteDoc(doc(getFirestore(), path))
  } catch (err) {
    throw new BackendError(err as string)
  }
}

export async function getAndUpdateDocument(
  path: string,
  updater: (data: IDoc) => unknown,
  options?: { merge?: boolean }
): Promise<void> {
  try {
    await runTransaction(getFirestore(), async transaction => {
      const docRef = doc(getFirestore(), path)
      const docData = await transaction.get(docRef)
      if (!docData.exists()) {
        throw new BackendError(`Document "${path}" not found`)
      }
      const oldData = mapDocId(docData)
      const newData = updater(oldData) as Partial<unknown>

      if (newData) {
        if (options) {
          transaction.set(docRef, newData, options)
        } else {
          transaction.set(docRef, newData)
        }
      }
    })
  } catch (err) {
    throw new BackendError(err as string)
  }
}
