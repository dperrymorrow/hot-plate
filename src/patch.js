
import Utils from './utils.js'

const SPECIAL = {
  text ($r, $v) {
    const desired = $v.innerHTMl
    const current = $r.innerHTML
    if (current !== desired) $r.innerHTML = $v.innerHTML
  },
  value ($r, $v) {
    const desired = $v.value === null ? '' : $v.value
    const current = $r.value
    if (current !== desired) $r.value = desired
  }
}

export default function ($vTree, needsPatched, trace) {
  console.groupCollapsed('updates')

  Object.entries(needsPatched).forEach(([id, props]) => {
    const $v = Utils.findId($vTree, id, true)
    const $r = Utils.findId(document, id, true)

    if ($r && $v) {
      props.forEach(prop => {
        if (trace) console.log('setting', prop, $r)
        if (prop in SPECIAL) SPECIAL[prop]($r, $v)
        else {
          const desired = $v.getAttribute(prop)
          const current = $r.getAttribute(prop)
          if (current !== desired) $r.setAttribute(prop, desired)
        }
      })
    }
  })

  console.groupEnd()
}
