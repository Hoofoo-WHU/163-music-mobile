{
  const app = window.app
  const Model = window.utils.Model
  const Controller = window.utils.Controller
  const View = window.utils.View
  const http = window.app.http
  let model = new Model({
    data: {
      songLists: null
    },
    methods: {
      async fetchSongLists() {
        return http.getLists(6)
      }
    }
  })
  let controller = new Controller({
    model,
    actions: {
      async updateSongLists() {
        let songLists = await this.model.fetchSongLists()
        this.view.renders.renderSongLists(songLists)
      }
    }
  })
  let view = new View({
    controller,
    elems: {
      $root: $('#recommend>.songs>main')
    },
    templates: {
      $songList({ objectId, cover, title, hot }) {
        return $(`
        <a class="song-list" href="/src/list?id=${objectId}">
          <figure>
            <img src="//${cover}">
            <i class="number">${hot}</i>
          </figure>
          <figcaption>${title}</figcaption>
        </a>`)
      }
    },
    renders: {
      renderSongLists(songLists) {
        songLists.forEach(songList => {
          this.elems.$root.append(this.templates.$songList(songList))
        })
      }
    },
    actions: {
    },
    bindEvents() {
    },
    beforeMount() {
      this.controller.updateSongLists()
    }
  })
}