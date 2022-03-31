import algoliasearch from 'algoliasearch/lite'

const client = algoliasearch('BQA0T5JC4R', 'f88cfe8e1fab1c499588bbaddf715260')
const index = client.initIndex('dev_songdriver')

export async function searchSongs (query) {
  const { hits } = await index.search(query)

  return hits
}
