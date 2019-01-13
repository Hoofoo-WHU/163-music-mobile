{
  let EventHub = class {
    constructor() {
      this.events = new Map()
    }
    on(name, callback) {
      if (this.events.has(name)) {
        this.events.get(name).add(callback)
      } else {
        this.events.get(name) = new Set([callback])
      }
    }
    remove(name, callback) {
      if (this.events.has(name) && this.events.get(name).has(callback)) {
        this.events.get(name).delete(callback)
        if (this.events.get(name).size === 0) {
          this.events.delete(name)
        }
        return true
      }
      return false
    }
    emit(name, options, self) {
      if (this.events.has(name)) {
        this.events.get(name).forEach(callback => {
          callback.call(self, options)
        })
      }
    }
  }
  let Model = class {
    constructor({ methods, data }) {
      if (typeof methods === 'object') {
        Object.assign(this, methods)
      }
      this.data = data || {}
    }
  }
  let View = class {
    constructor({ controller, bindEvents, elems, renders, templates }) {
      Object.assign(this, { elems, templates, controller, renders })
      this.controller.view = this
      bindEvents.call(this)
      for (let key in renders) {
        renders[key].bind(this)
      }
    }
  }

  let Controller = class {
    constructor({ model, actions }) {
      this.model = model
      this.view = null
      if (typeof actions === 'object') {
        Object.assign(this, actions)
      }
    }
  }

  window.utils = {
    EventHub,
    Model,
    View,
    Controller
  }
}
