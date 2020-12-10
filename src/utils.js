
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

  addId ($el) {
    const existing = [...$el.attributes].find((attr) => attr.name.startsWith(ID_PREFIX))
    if (existing) return existing.name.replace(ID_PREFIX, '')

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
  },

  findById ($tree, ids) {
    const search = ids.map(id => `[${ID_PREFIX}${id}]`).join(',')

    return Array.from($tree.querySelectorAll(search)).reduce((obj, $el) => {
      const {name} = Array.from($el.attributes).find(({name}) => name.startsWith(ID_PREFIX))
      obj[name.replace(ID_PREFIX, '')] = $el
      return obj
    }, {})
  }

}
