
import Utils from './utils.js'
import ProxyTrap from './proxy-trap.js'
import Patch from './patch.js'
import Inject from './inject.js'

export default {
  parse (template, parser) {
    return Inject(template, parser)
  },

  app ({template, data, parser, render, trace}) {
    const injected = this.parse(template, parser)

    const trap = ProxyTrap.create(data, function (changed) {
      const $v = Utils.getShadow(render(template, trap))
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

    return {data: trap, template: injected }
  }

}
