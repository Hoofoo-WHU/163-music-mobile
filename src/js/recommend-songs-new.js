{
  const app = window.app
  const http = app.http
  const eventHub = app.eventHub
  const Model = window.utils.Model
  const Controller = window.utils.Controller
  const View = window.utils.View
  let model = new Model({
    data: {
      songs: null
    },
    methods: {
      async fetchSongs() {
        this.data.songs = await http.getNewMusicList(10)
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
      $root: $('#recommend>.new-songs>main')
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
    bindEvents() {
      eventHub.on('nav.active', name => {
        if (name === 'recommend') {
          this.controller.loadSongs()
        }
      })
    },
    beforeMount() {
    }
  })
}