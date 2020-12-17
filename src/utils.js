
const ID_PREFIX = 'hp-'
const FN = 'fn'

export default {

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

  benchmark (fn, label, trace) {
    const start = new Date().getTime()
    fn()
    if (trace) console.log(label, new Date().getTime() - start, 'ms')
  },

  getId ($el) {
    const attr = [...$el.attributes].find((attr) => attr.name.startsWith(ID_PREFIX))
    return attr ? attr.name.replace(ID_PREFIX, '') : null
  },

  addId ($el) {
    const existing = this.getId($el)
    if (existing) return existing

    const min = Date.now()
    const uniq = Math.round(Math.random() * (9999999999999 - min) + min).toString(36)
    $el.setAttribute(`${ID_PREFIX}${uniq}`, '')
    return uniq
  },

  wrap ($el) {
    const $wrapper = document.createElement('span')
    const id = this.addId($wrapper)
    $el.parentNode.insertBefore($wrapper, $el)
    $wrapper.append($el)
    return id
  }

}
