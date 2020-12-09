
const ATTR = 'hp-live'
const ID = 'hp-id'
const DILEM = '|'
const FN = 'fn'

export default {
  random () {
    const min = Date.now()
    return Math.round(Math.random() * (9999999999999 - min) + min).toString(36)
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

  setAttrTrigger ($el, attr, triggers) {
    $el.setAttribute(ID, this.random())

    triggers = triggers.map(trigger => trigger.endsWith(')') ? FN : trigger
    ).join(',')

    const existing = $el.getAttribute(ATTR) ? $el.getAttribute(ATTR).split(DILEM) : []
    $el.setAttribute(ATTR, existing.concat(`${attr}:${triggers}`).join(DILEM))
  },

  attrQuery: (changed) => changed.map(path => `[${ATTR}*=":${path}"]`).concat(`[${ATTR}*=":*"]`).join(),

  // textQuery: (changed) => changed.map(path => `[hp-text*="${path}"]`).concat(`[hp-text*="*"]`).join(),

  // NOT SURE IF WE NEED THIS STUFF

  // hotAttrs ($el) {
  //   const val = $el.getAttribute(ATTR)
  //   return val ? val.split(',').reduce((acc, pair) => {
  //     const [att, trigger] = pair.split(':')
  //     acc[att] = trigger
  //     return acc
  //   }, {}) : null
  // },

  getMatch: ($el) => document.querySelector(`[${ID}="${$el.getAttribute(ID)}"]`)

}
