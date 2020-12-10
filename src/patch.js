
import Utils from './utils.js'

const SPECIAL = {
  text ($r, $v) {
    $r.innerText = $v.innerText
  },
  value ($r, $v) {
    if ($v.value) $r.value = $v.value
    else $r.value = ''
  }
}

export default function ($vTree, needsPatched, trace) {
  console.groupCollapsed('updates')

  Object.entries(needsPatched).forEach(([id, props]) => {
    // console.log(id, props)
    const $v = Utils.findId($vTree, id, true)
    const $r = Utils.findId(document, id, true)

    if ($r && $v) {
      props.forEach(prop => {
        if (trace) console.log('setting', prop, $r)
        if (prop in SPECIAL) SPECIAL[prop]($r, $v)
        else $r.setAttribute(prop, $v.getAttribute(prop))
      })
    }
  })

  console.groupEnd()
}
