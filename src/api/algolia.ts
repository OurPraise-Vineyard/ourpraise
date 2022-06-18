import algoliasearch from 'algoliasearch/lite'

const client = algoliasearch('BF560MHA8D', '1d21dece723f3c5b40a8ae2faad53c0f')
const index = client.initIndex('dev_ourpraise')

export async function searchSongs (query) {
  const { hits } = await index.search(query)

  return hits
}
