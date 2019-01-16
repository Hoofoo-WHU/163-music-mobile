{
  const app = window.app
  const eventHub = window.app.eventHub
  const Model = window.utils.Model
  const Controller = window.utils.Controller
  const View = window.utils.View

  let model = new Model({
    data: {
      active: undefined
    },
    methods: {
      active(tabName) {
        this.data.active = tabName
      }
    }
  })
  let controller = new Controller({
    model,
    actions: {
      active(tabName) {
        this.model.active(tabName)
        this.view.active(tabName)
        eventHub.emit('nav.active', tabName)
      }
    }
  })
  let view = new View({
    controller,
    elems: {
      $root: $('#app>nav'),
      $tabTitles: $('#app>nav>.tab'),
      $tabs: $('#app>main>.tab')
    },
    templates: {
    },
    renders: {
    },
    actions: {
      active(tabName) {
        this.elems.$tabTitles.removeClass('active')
        this.elems.$tabTitles.filter(`[tab-for="${tabName}"]`).addClass('active')
        this.elems.$tabs.removeClass('active')
        this.elems.$tabs.filter(`[tab-name="${tabName}"]`).addClass('active')
        app.state.scrollTop = 0
      }
    },
    bindEvents() {
      this.elems.$tabTitles.on('click', (e) => {
        this.controller.active($(e.currentTarget).attr('tab-for'))
      })
    },
    beforeMount() {
      this.controller.active(this.elems.$tabTitles.last().attr('tab-for'))
    }
  })
}