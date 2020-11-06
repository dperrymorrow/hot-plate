import Constants from './const.js'
const {regex, attrs} = Constants

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

  parseTemplate (tpl) {
    // give every live item a render id

    return tpl.replace(regex.item, (match, str) => {
      return match.replace(str, `${attrs.itemId}="${this.random()}" ${attrs.item}`)
    }).replace(regex.group, (match, str) => {
      return match.replace(str, `${attrs.groupId}="${this.random()}" ${attrs.group}`)
    })
  },

  matchAtts ($r, $v) {
    const rAtts = $r.attributes
    const vAtts = $v.attributes

    for (let i = vAtts.length - 1; i >= 0; i--) {
      const att = vAtts[i]
      if ($r.getAttribute(att.name) !== att.value) $r.setAttribute(att.name, att.value)
    }

    for (let i = rAtts.length - 1; i >= 0; i--) {
      const att = rAtts[i]
      if (!$v.hasAttribute(att.name)) $r.removeAttribute(att.name)
    }
  }

}
