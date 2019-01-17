{
  const http = window.app.http
  let URLParams = window.utils.URLParams
  let urlParams = new URLParams(window.location)
  ~async function () {
    let song = await http.getMusic(urlParams.id)
    console.log(song)
    let audio = $(`<audio src="//${song.url}" controls autoplay></audio>`)
    $('#app>main').append(audio)
    function play() {
      if ($(this).html() === '播放') {
        $(this).html('暂停')
        audio.trigger('play')
      } else {
        $(this).html('播放')
        audio.trigger('pause')
      }
    }
    $('#back').css({ 'background-image': `url(//${song.cover})` })
    $('#app>main').append($(`<h2>歌名：${song.name}</h2>`))
    $('#app>main').append($(`<h2>歌手：${song.singer}</h2>`))
    $('#app>main').append($(`<h2>专辑：${song.album}</h2>`))
    $('#app>main').append($(`<button>播放</button>`).on('click', play))
  }()
}