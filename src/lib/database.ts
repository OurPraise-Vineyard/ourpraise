import {
  DocumentData,
  QueryConstraint,
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
  setDoc,
  where
} from 'firebase/firestore'

import {
  ICollection,
  ICollectionQuery,
  IDoc,
  IDocCreate,
  IDocUpdate
} from '~/types/backend'

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
  where: whereField,
  orderBy: orderByField,
  sortDirection = 'asc'
}: ICollectionQuery): Promise<ICollection> {
  try {
    const filters: QueryConstraint[] = []

    if (whereField) {
      filters.push(where(...whereField))
    }

    if (orderByField) {
      filters.push(orderBy(orderByField, sortDirection))
    }

    return getDocs(
      query(collection(getFirestore(), collectionPath), ...filters)
    ).then(docs => mapDocsId(docs))
  } catch (err) {
    throw new BackendError(err as Error)
  }
}

export async function getDocument(path: string): Promise<IDoc> {
  let result
  try {
    result = await getDoc(doc(getFirestore(), path))
  } catch (err) {
    throw new BackendError(err as Error)
  }

  if (result.exists()) {
    return mapDocId(result)
  }

  throw new BackendError(new Error(`Document "${path}" does not exist.`))
}

export async function createDocument(path: string, value: IDocCreate) {
  try {
    return addDoc(collection(getFirestore(), path), value)
  } catch (err) {
    throw new BackendError(err as Error)
  }
}

export async function updateDocument(
  path: string,
  value: IDocUpdate
): Promise<void> {
  try {
    return setDoc(doc(getFirestore(), path), value, { merge: true })
  } catch (err) {
    throw new BackendError(err as Error)
  }
}

export async function deleteDocument(path: string) {
  try {
    return deleteDoc(doc(getFirestore(), path))
  } catch (err) {
    throw new BackendError(err as Error)
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
        throw new BackendError(new Error(`Document "${path}" not found`))
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
    throw new BackendError(err as Error)
  }
}
