
import Utils from './utils.js'
import ProxyTrap from './proxy-trap.js'
import Patch from './patch.js'
import Inject from './inject.js'
import ejs from './parsers/ejs.js'

export default {
  parsers: {
    ejs
  },

  app ({template, data, parser, render, trace}) {
    const store = {}
    const injected = Inject(template, parser, store)

    const trap = ProxyTrap.create(data, function (changed) {
      const $v = Utils.getShadow(render(injected, trap))
      const startTime = new Date().getTime()

      if (trace) {
        console.group('changed:', changed)
        console.log('vDom', $v)
      }

      Patch($v, changed, trace)

      if (trace) {
        const endTime = new Date().getTime()
        console.log('re-render took:', (endTime - startTime), 'ms')
        console.groupEnd()
      }
    })

    return {data: trap, template: injected, store}
  }

}
