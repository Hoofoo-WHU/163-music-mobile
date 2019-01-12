{
  let eventBus = window.app.eventBus
  let utils = window.utils
  let view = {
    init(el, controller, model) {
      this.el = $(el)
      this.controller = controller
      this.controller.init(this, model)
      this.bindEvent()
    },
    templates: {
      songRow: ({ name, singer, type, size }) => {
        return $(`<tr>
            <td>${name}</td>
            <td>${singer}</td>
            <td>${type}</td>
            <td>${size}</td>
            <td><div class="actions"></div></td>
          </tr>`)
      }
    },
    show() {
      this.el.addClass('active')
      this.controller.clear()
    },
    hide() {
      this.el.removeClass('active')
    },
    empty() {
      this.el.find('.uploadmusic').addClass('empty')
      this.el.find('tbody').html('')
    },
    unempty() {
      this.el.find('.uploadmusic').removeClass('empty')
    },
    renderSonglist(songlist) {
      this.empty()
      console.log(songlist)
      let $tbody = this.el.find('tbody')
      if (songlist && songlist.size) {
        this.unempty()
      }
      songlist.forEach(song => {
        let $songRow = this.templates.songRow(song)
        let $remove = $('<a>删除</a>')
        $remove.on('click', () => {
          this.controller.remove(song)
        })
        $songRow.find('.actions').append($remove)
        $tbody.append($songRow)
      })
    },
    bindEvent() {
      this.el.on('click', () => {
        this.hide()
      })
      this.el.find('.content').on('click', (e) => {
        e.stopPropagation()
      })
      this.el.find('.content').on('click', '.action.close', () => {
        this.hide()
      })
      this.el.find('.content').on('click', '.uploadarea', () => {
        this.controller.selectFiles()
      })
      eventBus.on('showupload', () => {
        this.show()
      })
      eventBus.on('hideupload', () => {
        this.hide()
      })
    }
  }

  let model = {
    songlist: {
      set(songlist) {
        this.songlist = songlist
      },
      get() {
        return this.songlist || new Set()
      },
      clear() {
        this.songlist && this.songlist.clear()
      },
      remove(song) {
        this.songlist && this.songlist.delete(song)
      }
    }
  }

  let controller = {
    init(view, model) {
      this.model = model
      this.view = view
    },
    clear() {
      this.model.songlist.clear()
      this.view.renderSonglist(this.model.songlist.get())
    },
    remove(song) {
      console.log(song)
      this.model.songlist.remove(song)
      this.view.renderSonglist(this.model.songlist.get())
    },
    selectFiles() {
      let $input = $('<input type="file" multiple accept="audio/*">')
      $input.on("change", (e) => {
        this.model.songlist.set(utils.toSonglist(e.target.files))
        this.view.renderSonglist(this.model.songlist.get())
      })
      $input.click()
    }
  }

  view.init('#uploadModal', controller, model)
}