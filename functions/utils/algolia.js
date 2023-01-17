const algoliasearch = require('algoliasearch/lite')

const client = algoliasearch('BF560MHA8D', '1d21dece723f3c5b40a8ae2faad53c0f')
const index = client.initIndex('dev_ourpraise')

exports.searchSongs = async query => {
  const { hits } = await index.search(query)

  return hits
}
