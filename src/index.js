
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

    const trap = ProxyTrap.create(data, function (changed) {
      const $v = Utils.getShadow(render(injected, trap))
      const toPatch = store.find(changed)
      const startTime = new Date().getTime()

      if (trace) {
        console.group('changed:', changed)
        console.log('needs patched:', toPatch)
        console.log('parsing store took:', (new Date().getTime() - startTime), 'ms')
        console.log('vDom:', $v)
      }

      Patch($v, toPatch, trace)

      if (trace) {
        console.log('re-render took:', (new Date().getTime() - startTime), 'ms')
        console.groupEnd()
      }
    })

    if (trace) {
      console.log(store.stash)
    }

    return {data: trap, template: injected, store}
  }

}
