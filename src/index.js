
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
      const startTime = new Date().getTime()
      if (trace) console.group('changed:', changed)

      const $v = Utils.getShadow(render(injected, trap))
      const toPatch = store.find(changed)
      const storeDone = new Date().getTime()

      Patch($v, toPatch, false)
      const renderDone = new Date().getTime()

      if (trace) {
        console.log('needs patched:', toPatch)
        console.log('parsing store took:', storeDone - startTime, 'ms')
        console.log('re-render took:', renderDone - startTime, 'ms')
        console.log('vDom:', $v)
        console.groupEnd()
      }
    })

    if (trace) console.log('store', store.stash)
    return {data: trap, template: injected, store}
  }

}
