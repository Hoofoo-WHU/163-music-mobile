{
  const app = window.app
  const http = app.http
  const Model = window.utils.Model
  const Controller = window.utils.Controller
  const View = window.utils.View
  let model = new Model({
    data: {
      songs: null
    },
    methods: {
      async fetchSongs() {
        let songs = await http.getMusicList({ k: 10 })
        return songs
      }
    }
  })
  let controller = new Controller({
    model,
    actions: {
      async updateSongs() {
        this.view.loading()
        let songs = await this.model.fetchSongs()
        this.view.renders.renderSongs(songs)
        this.view.loaded()
      }
    }
  })
  let view = new View({
    controller,
    elems: {
      $root: $('#recommend>.new-songs>main')
    },
    templates: {
      $song({ name, singer, album, sq, objectId }) {
        return $(`
        <a href="./play?id=${objectId}" class="song">
          <div class="info">
            <h2 class="line-clamp-1">${name}</h2>
            <p class="line-clamp-1">${sq ? '<i class="sq"></i>' : ''}${singer} - ${album}</p>
          </div>
          <div class="play"><i></i></div>
        </a>`)
      }
    },
    renders: {
      renderSongs(songs) {
        songs.forEach(song => {
          if (Math.random() >= 0.5) {
            song.sq = true
          }
          console.log(song)
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
    },
    beforeMount() {
      this.controller.updateSongs()
    }
  })
}