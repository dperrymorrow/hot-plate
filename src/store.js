import Utils from './utils.js'

export default {

  create () {
    const stash = []

    function _getItem (pointer, force = true) {
      const id = typeof pointer === 'object' ? Utils.getId(pointer) : pointer
      let item = stash.find(item => item.id === id)
      if (!item && force) {
        item = { props: {}, $el: null, id }
        stash.push(item)
      }
      return item
    }

    return {
      stash,
      addProp (id, prop, triggers, tpl) {
        _getItem(id).props[prop] = { triggers, tpl }
      },

      addScope ($el, scope) {
        _getItem($el, true).$scope = scope
      },

      registerNode ($el) {
        const {$scope} = _getItem($el, false) || {}

        function _parse ($node) {
          Array.from($node.children).forEach(_parse)

          const id = Utils.getId($node)
          if (!id) return

          let item = _getItem($node, false)

          if (!item) {
            item = {props: {}, id, $el: $node}
            stash.push(item)
          } else {
            item.$el = $node
          }

// if scope and multiple??
          if ($scope) {
            Object.keys(item.props).forEach(key => {
              let {triggers} = item.props[key]
              item.props[key].triggers = triggers.map(trigger => trigger.replace(`${$scope.pointer}.`, `${$scope.arr}.`)
            )
            })
          }

          if ($scope) item.$scope = $scope
        }

        _parse($el)
      },

      find (changed) {
        return stash.filter(({props}) => {
          const triggs = Object.values(props).reduce((acc, {triggers}) => {
            return acc.concat(triggers)
          }, [])

          return changed.some(change => triggs.includes(change))
        })
      }
    }
  }

}
