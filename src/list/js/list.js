{
  const http = window.app.http
  const URLParams = window.utils.URLParams
  const Model = window.utils.Model
  const View = window.utils.View
  const Controller = window.utils.Controller
  const NumberFormatter = window.utils.NumberFormatter
  let urlParams = new URLParams(window.location)
  let model = new Model({
    data: {

    },
    methods: {
      async fetchList(id) {
        this.data.list = await http.getList(id)
        this.data.list.songs.forEach(val => {
          if (parseInt(val.size) > 5) {
            val.sq = true
          }
        })
        return this.data.list
      },
      toggleIntro() {
        this.data.introActive = !this.data.introActive
        return this.data.introActive
      }
    }
  })
  let controller = new Controller({
    model,
    actions: {
      async loadList(id) {
        try {
          let list = await this.model.fetchList(id)
          this.view.renders.header(list)
          this.view.renders.intro(list)
          this.view.renders.songs(list.songs)
          this.view.loaded()
          console.log(list.songs)
        } catch (e) {
          alert('加载歌单失败')
        }
      },
      toggleIntro() {
        if (this.model.toggleIntro()) {
          this.view.activeIntro()
        } else {
          this.view.deactiveIntro()
        }
      }
    }
  })
  let view = new View({
    controller,
    elems: {
      $root: $('#app'),
      $header: $('#app>header'),
      $intro: $('#app>.intro'),
      $list: $('#app>.list'),
      $loading: $('#app>.loading')
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
      },
      $tag(name) {
        return $(`
          <span class="tag border-1px-radius">${name}</span>
        `)
      }
    },
    renders: {
      header({ title, cover, type, author, hot }) {
        this.elems.$header.find('.background').css('background-image', `url(//${cover})`)
        this.elems.$header.find('>main>figure').prepend($(`<img src="//${cover}">`))
        this.elems.$header.find('.list-icon').text(type)
        this.elems.$header.find('.number').text(new NumberFormatter(hot).unit())
        this.elems.$header.find('.title').text(title)
        this.elems.$header.find('.author .name').text(author)
      },
      intro({ tags, intro }) {
        let $intro = this.elems.$intro
        tags.forEach(val => {
          $intro.find('.tags').append(this.templates.$tag(val))
        })
        let $text = $intro.find('.text')
        if ($text.append(intro).height() > 60) {
          $intro.addClass('overflow')
        }
      },
      songs(songs) {
        songs.forEach((song, index) => {
          song.rank = index + 1
          this.elems.$list.append(this.templates.$songItem(song))
        })
      }
    },
    actions: {
      activeIntro() {
        this.elems.$intro.addClass('active')
      },
      deactiveIntro() {
        this.elems.$intro.removeClass('active')
      },
      loading() {
        this.elems.$loading.addClass('active')
      },
      loaded() {
        this.elems.$loading.removeClass('active')
      }
    },
    bindEvents() {
      this.elems.$intro.on('click', () => {
        if (this.elems.$intro.hasClass('overflow')) {
          this.controller.toggleIntro()
        }
      })
      console.log($('.openApp'))
      $('.openApp').on('click', () => {
        window.location = 'orpheus://'
      })
    },
    beforeMount() {
      this.controller.loadList(urlParams.id)
    }
  })
}