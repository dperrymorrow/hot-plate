
const ATTR = 'hp-live'
const ID_PREFIX = 'hp-'
const DILEM = '|'
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

  findId ($tree, id, single = true) {
    const search = `[${ID_PREFIX}${id}]`
    return single ? $tree.querySelector(search) : $tree.querySelectorAll(search)
  }

  // getMatch: ($el) => document.querySelector(`[${ID}="${$el.getAttribute(ID)}"]`)

}
