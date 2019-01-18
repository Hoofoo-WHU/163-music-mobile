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
      song: null,
      state: undefined
    },
    methods: {
      async fetch() {
        this.data.song = await http.getMusic(urlParams.id)
        if (this.data.song.objectId) {
          return this.data.song
        } else {
          throw new Error('歌曲不存在')
        }
      },
      toggleState() {
        this.state = this.state ? false : true
        return this.state
      },
      ended() {
        this.state = false
      }
    }
  })
  let controller = new Controller({
    model,
    actions: {
      async loadSong() {
        try {
          this.view.loading()
          let song = await this.model.fetch()
          console.log(song)
          this.view.setTitle(`${song.name} - ${song.singer} - 网易云音乐`)
          this.view.renders.audio(song.url)
          this.view.renders.background(song.cover)
          this.view.renders.cover(song.cover)
        } catch (e) {
          alert(e)
        }
      },
      toggleState() {
        if (this.model.toggleState()) {
          this.view.play()
        } else {
          this.view.pause()
        }
      },
      canplay() {
        this.view.loaded()
      },
      ended() {
        this.model.ended()
        this.view.ended()
      }
    }
  })
  let view = new View({
    controller,
    elems: {
      $root: $('#app'),
      $scoller: $('.content-wrapper .main-inner'),
      $player: $('.main-inner>.player'),
      $disc: $('.main-inner>.player .disc'),
      $audio: null,
      $loading: $('#app>.loading')
    },
    templates: {
      $background(url) {
        return $(`<div class="background"></div>`).css({ backgroundImage: `url(//${url})` })
      },
      $cover(url) {
        return $(`<div class="cover"></div>`).css({ backgroundImage: `url(//${url})` })
      },
      $audio(url) {
        return $(`<audio src="//${url}"></audio>`)
      }
    },
    renders: {
      background(url) {
        this.elems.$root.prepend(this.templates.$background(url))
      },
      cover(url) {
        this.elems.$disc.find('.light').append(this.templates.$cover(url))
      },
      audio(url) {
        this.elems.$audio = this.templates.$audio(url)
        this.elems.$audio.on('canplay', () => {
          this.controller.canplay()
        })
        this.elems.$audio.on('ended', () => {
          this.controller.ended()
        })
        this.elems.$root.append(this.elems.$audio)
      }
    },
    actions: {
      setTitle(title) {
        document.title = title
      },
      updatePlayerSize() {
        this.elems.$player.height(this.elems.$scoller.parent().height())
      },
      play() {
        this.elems.$audio.trigger('play')
        this.elems.$disc.addClass('play')
      },
      pause() {
        this.elems.$audio.trigger('pause')
        this.elems.$disc.removeClass('play')
      },
      loading() {
        this.elems.$loading.addClass('active')
      },
      loaded() {
        this.elems.$loading.removeClass('active')
      },
      ended() {
        this.elems.$disc.removeClass('play')
      }
    },
    bindEvents() {
      $(window).on('resize', () => {
        this.updatePlayerSize()
      })
      this.elems.$player.on('click', () => {
        this.controller.toggleState()
      })
    },
    beforeMount() {
      this.updatePlayerSize()
      this.controller.loadSong()
    }
  })
}