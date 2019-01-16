{
  const app = window.app
  const http = app.http
  const eventHub = app.eventHub
  const Model = window.utils.Model
  const View = window.utils.View
  const Controller = window.utils.Controller
  let model = new Model({
    data: {
      songs: null
    },
    methods: {
      async fetchSongs() {
        this.data.songs = await http.getMusicList({ k: 2 })
        return this.data.songs
      }
    }
  })
  let controller = new Controller({
    model,
    actions: {
      async updateSongs() {
        this.view.loading()
        let songs = await this.model.fetchSongs()
        this.view.renders.time(new Date(songs[0].createdAt))
        this.view.renders.songs(songs)
        this.view.loaded()
      },
      loadSongs() {
        if (!this.model.data.songs) {
          this.updateSongs()
        }
      }
    }
  })
  let view = new View({
    controller,
    elems: {
      $root: $('#hot>main'),
      $time: $('#hot>header .time>span')
    },
    templates: {
      $song: app.TEMPLATES.SONG_ITEM
    },
    renders: {
      songs(songs) {
        songs.forEach(song => {
          if (Math.random() >= 0.5) {
            song.sq = true
          }
          this.elems.$root.append(this.templates.$song(song))
        })
      },
      time(date) {
        let updateDate = `${(date.getMonth() + 1).toString().padStart(2, 0)}月${date.getDay().toString().padStart(2, 0)}日`
        this.elems.$time.html(updateDate)
      }
    },
    actions: {
      loading() {
        this.elems.$root.addClass('loading')
      },
      loaded() {
        this.elems.$root.removeClass('loading')
      }
    },
    beforeMount() {
    },
    bindEvents() {
      eventHub.on('nav.active', name => {
        if (name === 'hot') {
          this.controller.loadSongs()
        }
      })
    }
  })
}