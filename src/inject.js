
import Constants from './const.js'
import Utils from './utils.js'

const {regex, attrs} = Constants

export default function (tpl, parser) {
  function _injectNode ($el) {
    const dynamic = Array.from($el.attributes).filter(att => parser.outlet.test(att.value))

    if (dynamic.length) {
      $el.setAttribute('hp-id', Utils.random())
      $el.setAttribute('hp-attrs', dynamic.map(item => {
        let key = item.value.replace(parser.outlet, (match, path) => path.trim())

        if (key.endsWith('()')) key = '(.*)'
        return `${item.name}:${key}`
      }).join(','))
    }
    // console.log(Utils.shallowClone($el))
    // console.log($el.innerText)
    // console.log(Utils.shallowClone($el).innerText)

    // console.log($el.cloneNode(false))

    Array.from($el.children).forEach(_injectNode)
    // only do this if we have dynamic attrs or content
  }

  const $shadow = Utils.getShadow(tpl)
  const cleanup = parser.cleanup || []

  Array.from($shadow.children).forEach(_injectNode)

  let injected = $shadow.innerHTML

  cleanup.forEach(({search, replace}) => {
    injected = injected.replace(search, replace)
  })
  return injected
}
