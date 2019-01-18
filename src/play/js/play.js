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
          this.view.setTitle(`${song.name} - ${song.singer} - 网易云音乐`)
          this.view.renders.background(song.cover)
          this.view.renders.cover(song.cover)
        } catch (e) {
          alert(e)
        }
      }
    }
  })
  let view = new View({
    controller,
    elems: {
      $root: $('#app'),
      $scoller: $('.content-wrapper .main-inner'),
      $player: $('.main-inner>.player'),
      $disc: $('.main-inner>.player .disc')
    },
    templates: {
      $background(url) {
        return $(`<div class="background"></div>`).css({ backgroundImage: `url(//${url})` })
      },
      $cover(url) {
        return $(`<div class="cover"></div>`).css({ backgroundImage: `url(//${url})` })
      }
    },
    renders: {
      background(url) {
        this.elems.$root.prepend(this.templates.$background(url))
      },
      cover(url) {
        this.elems.$disc.find('.light').prepend(this.templates.$cover(url))
      }
    },
    actions: {
      setTitle(title) {
        document.title = title
      },
      updatePlayerSize() {
        this.elems.$player.height(this.elems.$scoller.parent().height())
      }
    },
    bindEvents() {
      $(window).on('resize', () => {
        this.updatePlayerSize()
      })
    },
    beforeMount() {
      this.updatePlayerSize()
      this.controller.loadSong()
    }
  })
}