{
  const app = window.app
  const Model = window.utils.Model
  const Controller = window.utils.Controller
  const View = window.utils.View
  let model = new Model({
    data: {
      songs: null
    },
    methods: {
      async fetchSongs() {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            let song = {
              name: '胜梅桥',
              singer: '田震',
              sq: true
            }
            this.data.songs = Array(10).fill(song)
            resolve(this.data.songs)
          }, 3000)
        })
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
      $song({ name, singer, sq }) {
        return $(`
        <a url="javascript:;" class="song">
          <div class="info">
            <h2 class="line-clamp-1">${name}</h2>
            <p class="line-clamp-1">${sq ? '<i class="sq"></i>' : ''}${singer} - ${name}</p>
          </div>
          <div class="play"><i></i></div>
        </a>`)
      }
    },
    renders: {
      renderSongs(songs) {
        songs.forEach(song => {
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