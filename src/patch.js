
import Utils from './utils.js'

export default function ($vTree, changed, trace) {
  $vTree.querySelectorAll(Utils.attrQuery(changed)).forEach($v => {
    const $r = Utils.getMatch($v)
    const attrs = Utils.hotAttrs($r)

    if (trace) {
      console.log('patching attributes:', attrs)
      console.log($r)
    }

    Object.keys(attrs).forEach(key => {
      if (key === 'value') $r.value = $v.value
      else $r.setAttribute(key, $v.getAttribute(key))
    })
  })

  $vTree.querySelectorAll(Utils.textQuery(changed)).forEach($v => {
    const $r = Utils.getMatch($v)

    if (trace) {
      console.log('patching text:', $r.getAttribute('hp-text'))
      console.log($r)
    }

    if ($r) $r.innerText = $v.innerText
  })
}
