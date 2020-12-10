
import Utils from './utils.js'
const TXT_VALUE = ['TEXTAREA']

export default function (tpl, parser, store) {
  function _getKeys (outlets) {
    outlets = outlets || []
    return outlets.map(match => match.replace(parser.outlet, (match, path) => path))
  }

  function _handleProps ($el) {
    const id = Utils.addId($el)

    const dynamic = Array.from($el.attributes).reduce((acc, att) => {
      const {name, value} = att
      const keys = _getKeys(att.value.match(parser.outlet))
      if (keys.length) acc[name] = keys
      return acc
    }, {})

    if (Object.keys(dynamic).length) {
      Object.entries(dynamic).forEach(([key, triggers]) => store.addProp(id, key, triggers))
    }
  }

  function _textNode ($el) {
    const $parent = $el.parentElement
    const matches = $el.textContent.match(parser.outlet)

    if (matches && matches.length) {
      const triggers = _getKeys(matches)

      if ($parent && TXT_VALUE.includes($parent.tagName)) {
        const id = Utils.addId($parent)
        store.addProp(id, 'value', triggers)
      } else {
        const id = Utils.wrap($el)
        store.addProp(id, 'text', triggers)
      }
    } else {
      const iterations = $el.textContent.match(parser.iterate)
      if (iterations && iterations.length) {
        const $parent = $el.parentNode

        iterations.forEach(match => {
          $el.parentNode.setAttribute('hp-iterate', Array.from(iterations).map(match => {
            return match.replace(parser.iterate, (match, key) => key)
          }).join(','))
        })
      }
    }
  }

  function _injectNode ($el) {
    if ($el.nodeType === Node.TEXT_NODE) _textNode($el)
    else _handleProps($el)

    Array.from($el.childNodes).forEach(_injectNode)
  }

  const $shadow = Utils.getShadow(tpl)
  const cleanup = parser.cleanup || []

  Array.from($shadow.childNodes).forEach(_injectNode)
  let injected = $shadow.innerHTML

  cleanup.forEach(({search, replace}) => {
    injected = injected.replace(search, replace)
  })
  return injected
}
