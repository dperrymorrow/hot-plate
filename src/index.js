
import Utils from './utils.js'
import ProxyTrap from './proxy-trap.js'
import Patch from './patch.js'
import Inject from './inject.js'
import ejs from './parsers/ejs.js'
import Store from './store.js'

export default {
  parsers: {
    ejs
  },

  app ({ template, data, engine, trace, $el }) {
    const store = Store.create()
    const injected = Inject(template, engine, store)

    const { render } = engine

    const trap = ProxyTrap.create(data, function (changed) {
      if (trace) console.group('changed:', changed)

      let toPatch, patched

      Utils.benchmark(() => {
        toPatch = store.find(changed)
      }, 'parsing store', trace)

      Utils.benchmark(() => {
        patched = Patch(changed, toPatch, render, trap, trace)
      }, `patching DOM`, trace)

      if (trace) {
        console.log('patched:', patched, 'DOM elements')
        console.groupEnd()
      }
    })

    if (trace) console.log('store', store.stash)

    const observer = new MutationObserver(function ([record]) {
      const { addedNodes, removedNodes } = record
      Array.from(addedNodes)
        .filter($node => $node.nodeType === Node.ELEMENT_NODE).forEach(store.registerNode)
    })

    // Start observing the target node for configured mutations
    observer.observe($el, { childList: true })
    $el.innerHTML = render(injected, trap)

    return { data: trap, template: injected, store }
  }

}
