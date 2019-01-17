{
  const http = window.app.http
  let URLParams = window.utils.URLParams
  let urlParams = new URLParams(window.location)
  ~async function () {
    let song = await http.getMusic(urlParams.id)
    console.log(song)
    let audio = $(`<audio src="//${song.url}" controls autoplay></audio>`)
    $('body').append(audio)
    function play() {
      if ($(this).html() === '播放') {
        $(this).html('暂停')
        audio.trigger('play')
      } else {
        $(this).html('播放')
        audio.trigger('pause')
      }
    }
    $('body').append($(`<img src="//${song.cover}" style="width:100vw">`))
    $('body').append($(`<h2>歌名：${song.name}</h2>`))
    $('body').append($(`<h2>歌手：${song.singer}</h2>`))
    $('body').append($(`<h2>专辑：${song.album}</h2>`))
    $('body').append($(`<button>播放</button>`).on('click', play))
  }()
}