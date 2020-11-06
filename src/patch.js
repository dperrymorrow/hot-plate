import Utils from './utils.js'
import Constants from './const.js'
const {regex, attrs} = Constants

const custom = [
  {
    compare: ($r, $v) => $r.value === $v.value,
    update: ($r, $v) => $r.value = $v.value
  }
]

function _shouldPatch (watching, changed) {
  const watchingItems = watching.length ? watching.split(',') : []
  return watchingItems.length ? changed.some(change => watchingItems.some(watch => change.match(watch))) : true
}

function _patch ($r, $v) {
  custom.forEach(att => {
    if (!att.compare($r, $v)) att.update($r, $v)
  })

  Utils.matchAtts($r, $v)

  if ($r.isEqualNode($v)) return

  // we dont replace items with no children
  if (!$v.children.length) {
    if ($v.innerText !== $r.innerText) $r.innerText = $v.innerText
    return
  }

  if ($r.outerHTML !== $v.outerHTML) $r.replaceWith($v.cloneNode(true))
}

export default function ($rTree, $vTree, changed, trace) {
  const results = {removed: [], added: [], patched: []}

  $rTree.querySelectorAll(`[${attrs.itemId}]`).forEach($r => {
    if (!_shouldPatch($r.getAttribute(attrs.item), changed)) return
    const $v = $vTree.querySelector(`[${attrs.itemId}="${$r.getAttribute('item-id')}"]`)

    if (!$v) {
      $r.remove()
      results.removed.push($r)
    } else {
      results.patched.push($v)
      _patch($r, $v)
    }
  })

  $rTree.querySelectorAll(`[${attrs.groupId}]`).forEach($rGroup => {
    if (!_shouldPatch($rGroup.getAttribute(attrs.group), changed)) return

    const $vGroup = $vTree.querySelector(`[${attrs.groupId}="${$rGroup.getAttribute(attrs.groupId)}"]`)

    Array.from($vGroup.children).forEach(($v, index) => {
      const $r = $rGroup.children[index]
      if (!$r) {
        results.added.push($rGroup.appendChild($v.cloneNode(true)))
      } else {
        _patch($r, $v)
        results.patched.push($r)
      }
    })

    Array.from($rGroup.children).forEach(($r, index) => {
      if (!$vGroup.children[index]) {
        $r.remove()
        results.removed.push($r)
      }
    })

    _patch($rGroup, $vGroup)
  })

  if (trace) {
    Object.keys(results).forEach(key => {
      if (results[key].length) {
        console.groupCollapsed(key, results[key].length)
        results[key].forEach($el => console.log($el))
        console.groupEnd()
      }
    })
  }
}
