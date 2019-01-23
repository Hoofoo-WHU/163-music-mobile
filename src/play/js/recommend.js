{
  const http = window.app.http
  const URLParams = window.utils.URLParams
  const Model = window.utils.Model
  const View = window.utils.View
  const Controller = window.utils.Controller
  let urlParams = new URLParams(window.location)
  let model = new Model({
    data: {
      songs: []
    },
    methods: {
      async fetchSongs(id) {
        this.data.songs = await http.getSongMore(id)
        this.data.songs.forEach(val => {
          if (parseInt(val.size) > 5) {
            val.sq = true
          }
        })
        return this.data.songs
      }
    }
  })
  let controller = new Controller({
    model,
    actions: {
      async loadSongs() {
        let songs = await this.model.fetchSongs(urlParams.id)
        this.view.renders.songs(songs)
      }
    }
  })
  let view = new View({
    controller,
    elems: {
      $root: $('#recommend>.songs')
    },
    templates: {
      $songItem({ objectId, rank, name, sq, singer, album }) {
        return $(`
          <a href="../play?id=${objectId}" class="song-item">
            ${rank === undefined ? '' : `<div class="rank">${rank}</div>`}
            <main class="boder-bottom-1px light">
              <div class="info">
                <h2 class="line-clamp-1">${name}</h2>
                <p class="line-clamp-1">${sq ? '<i class="sq"></i>' : ''}${singer} - ${album}</p>
              </div>
              <div class="play"><i></i></div>
            </main>
          </a>`)
      }
    },
    renders: {
      songs(songs) {
        songs.forEach(song => {
          this.elems.$root.append(this.templates.$songItem(song))
        })
      }
    },
    actions: {
    },
    bindEvents() {
    },
    beforeMount() {
      this.controller.loadSongs()
    }
  })
}