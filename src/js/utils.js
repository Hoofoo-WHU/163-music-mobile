{
  let EventHub = class {
    constructor() {
      this.events = new Map()
    }
    on(name, callback) {
      if (this.events.has(name)) {
        this.events.get(name).add(callback)
      } else {
        this.events.set(name, new Set([callback]))
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
    constructor({ controller, bindEvents, elems, renders, templates, beforeMount, actions }) {
      Object.assign(this, { elems, templates, controller, renders }, actions)
      this.controller.view = this
      for (let key in this.renders) {
        renders[key] = renders[key].bind(this)
      }
      beforeMount.call(this)
      bindEvents.call(this)
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

  let URLParams = class {
    constructor(location) {
      if (location.search !== '') {
        location.search.slice(1).split('&').forEach(kv => {
          let kva = kv.split('=')
          this[kva[0]] = kva[1]
        })
      }
    }
  }
  function isMobile() {
    if (!!window.navigator.userAgent.match(/AppleWebKit.*Mobile.*/) && !!window.navigator.userAgent.match(/AppleWebKit/)) {
      return true
    } else {
      return false
    }
  }
  let Lrc = class {
    constructor(lrctxt) {
      this.lrctxt = lrctxt.replace()
      this.reg = /\[([\d:\.]+)\](.+)/g
    }
    next() {
      let matches = this.reg.exec(this.lrctxt)
      if (matches) {
        let time = matches[1].split(':')
        return { time: time[0] * 60 + (+time[1]), text: matches[2].trim() }
      }
      return null
    }
    behind() {
      let res = []
      let i = null
      while (i = this.next()) {
        res.push(i)
      }
      return res
    }
  }

  window.utils = {
    EventHub,
    Model,
    View,
    Controller,
    URLParams,
    Lrc,
    isMobile
  }
}
