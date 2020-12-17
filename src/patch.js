
import Utils from './utils.js'

const SPECIAL = {
  text ($r, val) {
    $r.innerHTML = val
  },
  value ($r, val) {
    if (document.activeElement !== $r) $r.value = val
  }
}

export default function (paths, needsPatched, render, data) {
  let changed = 0

  Object.entries(needsPatched).forEach(([id, def]) => {
    const $r = def.$el

    if ($r) {
      Object.entries(def.props)
      .filter(([prop, def]) => def.triggers.some(trigger => paths.includes(trigger)))
      .forEach(([prop, def]) => {
        const val = render(def.tpl, data)

        if (prop in SPECIAL) SPECIAL[prop]($r, val)
        else $r.setAttribute(prop, val)

        changed++
      })
    }
  })

  return changed
}
