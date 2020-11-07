
export default {
  random () {
    const min = Date.now()
    return Math.round(Math.random() * (9999999999999 - min) + min)
  },

  debounce (callback, wait = 0) {
    let timeout = null

    return function () {
      const next = () => callback.apply(this, arguments)
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(next, wait)
    }
  },

  getShadow (html) {
    const $tmp = document.createElement('div')
    $tmp.innerHTML = html
    return $tmp
  },

  attrQuery: (changed) => changed.map(path => `[hp-attrs*=":${path}"]`).concat(`[hp-attrs*=":*"]`).join(),

  hotAttrs ($el) {
    const val = $el.getAttribute('hp-attrs')
    return val ? val.split(',').reduce((acc, pair) => {
      const [att, trigger] = pair.split(':')
      acc[att] = trigger
      return acc
    }, {}) : null
  },

  shallowClone ($el) {
    const $clone = $el.cloneNode(false)
    Array.from($el.children).forEach($child => {
      if ($child.tagName) $child.remove()
    })
    return $clone
  },

  getMatch: ($el) => document.querySelector(`[hp-id="${$el.getAttribute('hp-id')}"]`)

}
