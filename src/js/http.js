{
  const axios = window.axios.create({
    baseURL: 'https://rs2cp2z7.api.lncld.net/1.1/',
    headers: {
      'Content-Type': 'application/json',
      'X-LC-Id': 'rs2cp2z7xlTRjINGpN4KAUfo-gzGzoHsz',
      'X-LC-Key': 'lzNwurWpUff2VlT037gR3orG'
    }
  })
  const axiosLE = window.axios.create({
    baseURL: 'https://163-mobile-music.leanapp.cn'
  })
  let getNewMusicList = async function (k) {
    let result = await axios.get(`cloudQuery?cql=select * from Songs ${k !== undefined ? `limit 0, ${k}` : ''} order by -createdAt`)
    return result.data.results
  }
  // let getMusic = async function (objectId) {
  //   let { data } = await axios.get(`classes/Songs/${objectId}`)
  //   return data
  // }
  let getHotMusicList = async function (k) {
    let result = await axios.get(`cloudQuery?cql=select * from Songs ${k !== undefined ? `limit 0, ${k}` : ''} order by -hot`)
    return result.data.results
  }
  let getMusic = async function (objectId) {
    let { data } = await axiosLE.get(`songs?id=${objectId}`)
    return data
  }
  window.app.http = {
    getHotMusicList,
    getNewMusicList,
    getMusic
  }
}