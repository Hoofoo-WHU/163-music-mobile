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
    let result = await axios.get(`cloudQuery?cql=select singer,name,objectId,album,size from Songs ${k !== undefined ? `limit 0, ${k}` : ''} order by -createdAt`)
    return result.data.results
  }
  // let getMusic = async function (objectId) {
  //   let { data } = await axios.get(`classes/Songs/${objectId}`)
  //   return data
  // }
  let getHotMusicList = async function (k) {
    let result = await axios.get(`cloudQuery?cql=select singer,name,objectId,album,size from Songs ${k !== undefined ? `limit 0, ${k}` : ''} order by -hot`)
    return result.data.results
  }
  let getMusic = async function (objectId) {
    let { data } = await axiosLE.get(`song?id=${objectId}`)
    return data
  }
  // let getList = async function (objectId) {
  //   let res1 = await axios.get(`classes/List/${objectId}`)
  //   let res2 = await axios.get(`cloudQuery?cql=select include song from SongListMap where list=pointer('List','${objectId}')`)
  //   res1.data.songs = res2.data.results.map(val => val.song)
  //   return res1.data
  // }
  let getList = async function (objectId) {
    let { data } = await axiosLE.get(`list?id=${objectId}`)
    return data
  }
  let getLists = async function (k) {
    let result = await axios.get(`cloudQuery?cql=select * from List ${k !== undefined ? `limit 0, ${k}` : ''} order by -hot`)
    return result.data.results
  }
  let getSongMore = async function (objectId, k = 10) {
    let { data } = await axiosLE.get(`/song/more?id=${objectId}&limit=${k}`)
    return data
  }
  window.app.http = {
    getHotMusicList,
    getNewMusicList,
    getMusic,
    getList,
    getLists,
    getSongMore
  }
}