
import Utils from './utils.js'

const SPECIAL = {
  text ($r, $v) {
    $r.innerHTML = $v.innerHTML
  },
  value ($r, $v) {
    const desired = $v.value === null ? '' : $v.value
    if (document.activeElement !== $r) $r.value = desired
  }
}

export default function ($vTree, needsPatched) {
  const changed = []

  const ids = Object.keys(needsPatched)
  const rMap = Utils.findById(document, ids)
  const vMap = Utils.findById($vTree, ids)

  Object.entries(needsPatched).forEach(([id, props]) => {
    const $r = rMap[id]
    const $v = vMap[id]

    if ($r && $v) {
      props.forEach(prop => {
        changed.push([prop, $r])
        if (prop in SPECIAL) SPECIAL[prop]($r, $v)
        else $r.setAttribute(prop, $v.getAttribute(prop))
      })
    }
  })

  return changed
}
