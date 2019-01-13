{
  let eventBus = window.app.eventBus
  let view = {
    el: $('.app aside main nav'),
    init(controller, model) {
      this.controller = controller
      controller.init(this, model)
      this.current = this.el.find('li.active')
      console.log(this.current)
      this.bindEvent()
    },
    bindEvent() {
      this.el.on('click', 'li', (e) => {
        this.controller.active(e.currentTarget)
      })
    },
    active(e) {
      if (!$(e).hasClass('active')) {
        this.current.removeClass('active')
        eventBus.emit(`${this.current.attr('for').toLowerCase()}.hide`)
        $(e).addClass('active')
        this.current = $(e)
        eventBus.emit(`${this.current.attr('for').toLowerCase()}.show`)
      }
    }
  }
  let model = {

  }
  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
    },
    active(e) {
      this.view.active(e)
    }
  }
  view.init(controller, model)
}