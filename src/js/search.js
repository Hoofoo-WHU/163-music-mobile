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

    },
    methods: {

    }
  })

  let controller = new Controller({
    model,
    actions: {
    }
  })
  let view = new View({
    controller,
    elems: {
      $root: $('#search'),
      $form: $('#search>form'),
      $input: $('#search>form input'),
      $figure: $('#search>form figure')
    },
    templates: {
    },
    renders: {
    },
    actions: {
      clear() {
        this.elems.$input.val('')
        this.elems.$input.focus()
        this.elems.$figure.addClass('empty')
      }
    },
    bindEvents() {
      eventHub.on('nav.active', name => {
        if (name === 'search') {
          this.elems.$input.focus()
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
        console.log('submit')
      })
    },
    beforeMount() {
    }
  })
}