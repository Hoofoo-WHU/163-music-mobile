{
  const http = window.app.http
  const URLParams = window.utils.URLParams
  const Model = window.utils.Model
  const View = window.utils.View
  const Controller = window.utils.Controller
  const urlParams = new URLParams(window.location)
  // ~async function () {
  //   let song = await http.getMusic(urlParams.id)
  //   console.log(song)
  //   let audio = $(`<audio src="//${song.url}" controls autoplay></audio>`)
  //   $('#app>main').append(audio)
  //   function play() {
  //     if ($(this).html() === '播放') {
  //       $(this).html('暂停')
  //       audio.trigger('play')
  //     } else {
  //       $(this).html('播放')
  //       audio.trigger('pause')
  //     }
  //   }
  //   $('#back').css({ 'background-image': `url(//${song.cover})` })
  //   $('#app>main').append($(`<h2>歌名：${song.name}</h2>`))
  //   $('#app>main').append($(`<h2>歌手：${song.singer}</h2>`))
  //   $('#app>main').append($(`<h2>专辑：${song.album}</h2>`))
  //   $('#app>main').append($(`<button>播放</button>`).on('click', play))
  // }()
  let model = new Model({
    data: {
      song: null
    },
    methods: {
      async fetch() {
        this.data.song = await http.getMusic(urlParams.id)
        if (this.data.song.objectId) {
          return this.data.song
        } else {
          throw new Error('歌曲不存在')
        }
      }
    }
  })
  let controller = new Controller({
    model,
    actions: {
      async loadSong() {
        try {
          let song = await this.model.fetch()
          console.log(song)
          this.view.renders.background(song.cover)
        } catch (e) {
          alert(e)
        }
      }
    }
  })
  let view = new View({
    controller,
    elems: {
      $scoller: $('.content-wrapper .main-inner')
    },
    templates: {
      $background(url) {
        return $(`<div class="background"></div>`).css({ backgroundImage: `url(//${url})` })
      }
    },
    renders: {
      background(url) {
        let $background = this.templates.$background(url)
        if (window.safari) {
          $background.addClass('safari')
        }
        $('#app').prepend($background)
      }
    },
    actions: {

    },
    bindEvents() {
    },
    beforeMount() {
      this.controller.loadSong()
    }
  })
}