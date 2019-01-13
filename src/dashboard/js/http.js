{
  let sessionToken = sessionStorage.getItem('dash_session')
  const axios = window.axios.create({
    baseURL: 'https://rs2cp2z7.api.lncld.net/1.1/',
    headers: {
      'Content-Type': 'application/json',
      'X-LC-Id': 'rs2cp2z7xlTRjINGpN4KAUfo-gzGzoHsz',
      'X-LC-Key': 'lzNwurWpUff2VlT037gR3orG'
    }
  })
  let login = function () {
    let username = window.prompt('用户名')
    let password = window.prompt('密码')
    axios.post('login', { username, password })
      .then(res => {
        console.log(res)
        this.sessionToken = res.data.sessionToken
        sessionStorage.setItem('dash_session', this.sessionToken)
      })
  }
  let getMusicList = async function () {
    let result = await axios.get('classes/Songs')
    return result.data.results
  }
  let addSong = async function ({ name, singer, type, size, url, md5 }) {
    let result = await axios({
      url: 'classes/Songs',
      method: 'post',
      headers: { 'X-LC-Session': sessionToken },
      data: { name, singer, type, size, url, md5 }
    })
  }
  if (!sessionToken) {
    login()
  }
  window.app.http = {
    getMusicList,
    addSong
  }
}