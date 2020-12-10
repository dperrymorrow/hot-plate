
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

  app ({template, data, parser, render, trace}) {
    const store = Store.create()
    const injected = Inject(template, parser, store)
    const $v = Utils.getShadow()

    const trap = ProxyTrap.create(data, function (changed) {
      if (trace) console.group('changed:', changed)

      let toPatch, patched

      Utils.benchmark(() => {
        $v.innerHTML = render(injected, trap)
      }, 're-render vDOM', trace)

      Utils.benchmark(() => {
        toPatch = store.find(changed)
      }, 'parsing store', trace)

      Utils.benchmark(() => {
        patched = Patch($v, toPatch, trace)
      }, 'patching DOM', trace)

      if (trace) {
        console.log('vDOM:', $v)
        console.groupCollapsed('patched:')
        patched.forEach(patch => console.log(...patch))
        console.groupEnd()
        console.groupEnd()
      }
    })

    if (trace) console.log('store', store.stash)
    return {data: trap, template: injected, store}
  }

}
