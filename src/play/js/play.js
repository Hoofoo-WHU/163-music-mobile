{
  const http = window.app.http
  const URLParams = window.utils.URLParams
  const Model = window.utils.Model
  const View = window.utils.View
  const Controller = window.utils.Controller
  const Lrc = window.utils.Lrc
  const debounce = window.utils.debounce
  const urlParams = new URLParams(window.location)
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
        this.data.state = this.data.state ? false : true
        return this.data.state
      },
      play() {
        this.data.state = true
      },
      pause() {
        this.data.state = false
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
          this.view.renders.background(song.cover)
          this.view.renders.cover(song.cover)
          this.view.renders.info(song.name, song.singer)
          this.view.renders.audio(song.url)
          let lrc = new Lrc(song.lyrics)
          this.model.data.lrc = lrc.behind()
          this.view.renders.lyrics(this.model.data.lrc)
        } catch (e) {
          alert('歌曲加载失败，刷新再试')
        }
      },
      toggleState() {
        if (this.model.toggleState()) {
          this.view.play()
        } else {
          this.view.pause()
        }
      },
      onPause() {
        this.model.pause()
        this.view.pauseAnimate()
      },
      onPlay() {
        this.model.play()
        this.view.playAnimate()
      },
      canplay() {
        this.view.loaded()
      },
      ended() {
        this.model.ended()
        this.view.ended()
        this.view.toLyrics(0)
      },
      timeupdate(time) {
        let last = this.model.data.lrc[0] && this.model.data.lrc[0].time
        this.model.data.lrc.every(val => {
          if (val.time > time) {
            return false
          }
          last = val.time
          return true
        })
        this.view.toLyrics(last)
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
      $loading: $('#app>.loading'),
      $info: $('.main-inner>.player .info'),
      $lyrics: $('.main-inner>.player .lyrics'),
      $arrow: $('.main-inner .more')
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
      },
      $info(name, singer) {
        return $(`<span>${name} - <span class="singer">${singer}</span></span>`)
      },
      $lyric(time, text) {
        return $(`<p class="row" data-time="${time}">${text}</p>`)
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
        if (utils.isMobile()) {
          this.controller.canplay()
        } else {
          this.elems.$audio.on('canplay', () => {
            this.controller.canplay()
          })
        }
        this.elems.$audio.on('play', () => {
          this.controller.onPlay()
        })
        this.elems.$audio.on('pause', () => {
          this.controller.onPause()
        })
        this.elems.$audio.on('ended', () => {
          this.controller.ended()
        })
        this.elems.$audio.on('timeupdate', e => {
          this.controller.timeupdate(e.target.currentTime)
        })
        this.elems.$root.append(this.elems.$audio)
      },
      info(name, singer) {
        this.elems.$info.append(this.templates.$info(name, singer))
      },
      lyrics(lyrics) {
        lyrics.forEach(lyric => {
          this.elems.$lyrics.append(this.templates.$lyric(lyric.time, lyric.text))
        })
      }
    },
    actions: {
      setTitle(title) {
        document.title = title
      },
      updatePlayerSize() {
        this.elems.$player.height(this.elems.$scoller.parent().height() + 1)
      },
      play() {
        this.elems.$audio.trigger('play')
      },
      pause() {
        this.elems.$audio.trigger('pause')
      },
      playAnimate() {
        this.elems.$disc.addClass('play')
      },
      pauseAnimate() {
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
      },
      toLyrics(time) {
        let curr = this.elems.$lyrics.find(`[data-time="${time}"]`)
        if (!curr.hasClass('active')) {
          this.elems.$lyrics.find('.active').removeClass('active')
          let currentRow
          if (time === 0) {
            currentRow = this.elems.$lyrics.children().first().addClass('active')
          } else {
            currentRow = curr.addClass('active')
          }
          let offsetY = -currentRow.offset().top + currentRow.parent().offset().top
          this.elems.$lyrics.css('transform', `translateY(${offsetY}px)`)
        }
      },
      showArrow() {
        this.elems.$arrow.addClass('active')
      },
      hideArrow() {
        this.elems.$arrow.removeClass('active')
      }
    },
    bindEvents() {
      window.addEventListener('resize', (e) => {
        this.updatePlayerSize()
      })
      this.elems.$player.on('click', () => {
        this.controller.toggleState()
      })
      this.elems.$scoller.on('scroll', debounce((e) => {
        if (e.currentTarget.scrollTop > 35) {
          this.hideArrow()
        } else {
          this.showArrow()
        }
      }, 100))
      this.elems.$arrow.on('click', (e) => {
        e.stopPropagation()
        this.elems.$scoller.animate({ scrollTop: this.elems.$scoller.parent().height() }, 400)
      })
    },
    beforeMount() {
      this.updatePlayerSize()
      this.controller.loadSong()
    }
  })
}