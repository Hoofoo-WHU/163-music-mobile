{
  const app = window.app
  const Model = window.utils.Model
  const Controller = window.utils.Controller
  const View = window.utils.View
  let model = new Model({
    data: {
      songLists: null
    },
    methods: {
      async fetchSongLists() {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            let songList = {
              img: 'http://p1.music.126.net/BtWoYayeLOqAliYSr3dbPA==/109951163559155818.webp?imageView&thumbnail=246x0&quality=75&tostatic=0&type=webp',
              title: '摇滚时光 I 100支传奇的摇滚乐队'
            }
            this.data.songLists = Array(6).fill(songList)
            resolve(this.data.songLists)
          }, 100)
        })
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
      $songList({ img, title }) {
        return $(`
        <a class="song-list">
          <figure>
            <img src="${img}">
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