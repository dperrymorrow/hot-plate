
import Utils from './utils.js'

export default {
  create (data, callback) {
    let que = []

    const _debounced = Utils.debounce(() => {
      callback(que)
      que = []
    }, 10)

    const _addToQue = path => {
      if (!que.includes(path)) que.push(path)
      _debounced(que)
    }

    function _buildProxy (raw, tree = []) {
      return new Proxy(raw, {
        get: function (target, prop) {
          const value = Reflect.get(...arguments)

          if (value && typeof value === 'object' && ['Array', 'Object'].includes(value.constructor.name)) {
            return _buildProxy(value, tree.concat(prop))
          }

          return value
        },

        set: function (target, prop, value) {
          const ret = Reflect.set(...arguments)
          const path = tree.concat(prop).join('.')
          _addToQue(path)
          return ret
        },

        deleteProperty: function (target, prop) {
          const ret = Reflect.deleteProperty(...arguments)
          const path = tree.concat(prop).join('.')
          _addToQue(path)
          return ret
        }
      })
    }

    return _buildProxy(data)
  }
}
