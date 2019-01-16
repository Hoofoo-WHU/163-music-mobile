{
  const app = window.app
  const utils = window.utils
  const http = app.http
  const eventHub = app.eventHub
  const Model = window.utils.Model
  const Controller = window.utils.Controller
  const View = window.utils.View

  let model = new Model({
    data: {
      hots: null,
      historys: null
    },
    methods: {
      async fetchHot() {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            this.data.hots = ['起风了', '西城男孩', '林俊杰', '陈奕迅', '不染', '音乐新力量', '芳心纵火', '幕后之王', '坚强的理由', '左手指月']
            resolve(this.data.hots)
          }, 1000)
        })
      },
      async fetchHistory() {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            this.data.historys = this.data.historys || JSON.parse(localStorage.getItem('search_history')) || []
            resolve(this.data.historys)
          })
        })
      },
      addHistory(val) {
        this.removeHistory(val)
        this.data.historys.unshift(val)
        localStorage.setItem('search_history', JSON.stringify(this.data.historys))
      },
      removeHistory(val) {
        this.data.historys = this.data.historys.filter(e => e !== val)
        localStorage.setItem('search_history', JSON.stringify(this.data.historys))
      },
      search(val) {
        alert('没有实现搜索接口')
        this.addHistory(val)
      }
    }
  })

  let controller = new Controller({
    model,
    actions: {
      async updateHot() {
        this.view.loading()
        let hots = await this.model.fetchHot()
        this.view.renders.hots(hots)
        this.view.loaded()
        return true
      },
      async updateHistory() {
        let historys = await this.model.fetchHistory()
        this.view.renders.historys(historys)
      },
      async load() {
        if (!this.model.data.hots) {
          await this.updateHot()
          this.updateHistory()
        }
      },
      search(val) {
        this.model.search(val)
        this.updateHistory()
      },
      removeHistory(val) {
        this.model.removeHistory(val)
        this.updateHistory()
      }
    }
  })
  let view = new View({
    controller,
    elems: {
      $root: $('#search'),
      $form: $('#search>form'),
      $input: $('#search>form input'),
      $figure: $('#search>form figure'),
      $history: $('#search>.history>ul'),
      $hots: $('#search>.hotlist>ul')
    },
    templates: {
      $historyItem(text) {
        return $(`<li>
          <i></i>
          <div class="boder-bottom-1px light">
            <span class="line-clamp-1">${text}</span>
            <figure></figure>
          </div>
        </li>`)
      },
      $hotItem(text) {
        return $(`<li class="boder-1px-radius">${text}</li>`)
      }
    },
    renders: {
      historys(historys) {
        this.elems.$history.html('')
        historys.forEach(val => {
          let hi = this.templates.$historyItem(val)
          hi.on('click', () => {
            console.log('ssss')
            this.controller.search(val)
          })
          hi.on('click', 'figure', (e) => {
            e.stopPropagation()
            this.controller.removeHistory(val)
          })
          this.elems.$history.append(hi)
        })
      },
      hots(hots) {
        hots.forEach(val => {
          let hi = this.templates.$hotItem(val)
          hi.on('click', () => {
            this.controller.search(val)
          })
          this.elems.$hots.append(hi)

        })
      }
    },
    actions: {
      clear() {
        this.elems.$input.val('')
        this.elems.$input.focus()
        this.elems.$figure.addClass('empty')
      },
      loading() {
        this.elems.$hots.addClass('loading')
      },
      loaded() {
        this.elems.$hots.removeClass('loading')
      }
    },
    bindEvents() {
      eventHub.on('nav.active', name => {
        if (name === 'search') {
          this.elems.$input.focus()
          this.controller.load()
        }
      })
      this.elems.$input.on('input', (e) => {
        if (e.target.value.length > 0) {
          this.elems.$figure.removeClass('empty')
        } else {
          this.elems.$figure.addClass('empty')
        }
      })
      this.elems.$figure.on('click', () => {
        this.clear()
      })
      this.elems.$form.on('submit', (e) => {
        e.preventDefault()
        this.elems.$input.blur()
        let val = this.elems.$input.val()
        if (val !== '') {
          this.controller.search(val)
          console.log('submit', val)
        }
      })
    },
    beforeMount() {
    }
  })
}