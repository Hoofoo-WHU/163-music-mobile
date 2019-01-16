{
  const http = window.app.http
  let URLParams = window.utils.URLParams
  let urlParams = new URLParams(window.location)
  ~async function () {
    let song = await http.getMusic(urlParams.id)
    $('body').append($(`<audio src="//${song.url}" controls autoplay></audio>`))
  }()
}