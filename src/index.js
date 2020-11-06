
import Utils from './utils.js'
import ProxyTrap from './proxy-trap.js'
import Patch from './patch.js'

export default function ({template, data, render, $target, trace}) {
  const injected = Utils.parseTemplate(template)

  const trap = ProxyTrap.create(data, function (changed) {
    const $v = Utils.getShadow(render(injected, trap))
    const startTime = new Date().getTime()

    if (trace) {
      console.group('changed:', ...changed)
      console.log('vDom', $v)
    }

    Patch($target, $v, changed, trace)

    if (trace) {
      const endTime = new Date().getTime()
      console.log('re-render took: ' + (endTime - startTime) + 'ms')
      console.groupEnd()
    }
  })

  $target.innerHTML = render(injected, trap)
  return { template: injected, data: trap }
}
