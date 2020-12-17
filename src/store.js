import Utils from './utils.js'

export default {

  create () {
    const stash = {}

    function _getItem (id) {
      let item = stash[id]
      if (!item) item = stash[id] = { props: {} }
      return item
    }

    return {
      stash,
      addProp (id, prop, triggers, tpl) {
        _getItem(id).props[prop] = { triggers, tpl }
      },

      addScope (id, path, item, index) {
        _getItem(id).$scope = path
      },

      registerNode ($el) {
        const _parse = ($node) => {
          const id = Utils.getId($node)
          if (id && id in stash) {
            stash[id].$el = $node
          }
          Array.from($node.children).forEach(_parse)
        }

        _parse($el)
      },

      find (changed) {
        return Object.entries(stash).reduce((ret, [id, item]) => {
          const matches = Object.entries(item.props).filter(([prop, val]) => {
            return changed.some(change => val.triggers.includes(change))
          })

          if (matches.length) ret[id] = item
          return ret
        }, {})
      }
    }
  }

}
