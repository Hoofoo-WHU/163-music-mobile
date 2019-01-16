{
  let eventHub = window.app.eventHub
  const axios = window.axios.create({
    baseURL: 'https://rs2cp2z7.api.lncld.net/1.1/',
    headers: {
      'Content-Type': 'application/json',
      'X-LC-Id': 'rs2cp2z7xlTRjINGpN4KAUfo-gzGzoHsz',
      'X-LC-Key': 'lzNwurWpUff2VlT037gR3orG'
    }
  })
  let getMusicList = async function ({ k, order = '-' } = { order: '-' }) {
    let result = await axios.get(`cloudQuery?cql=select * from Songs ${k !== undefined ? `limit 0, ${k}` : ''} order by ${order}createdAt`)
    return result.data.results
  }
  window.app.http = {
    getMusicList
  }
}