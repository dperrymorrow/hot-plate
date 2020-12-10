export default {

  create () {
    const stash = {}

    return {
      stash,
      addProp (id, prop, triggers) {
        const existing = stash[id]

        if (existing) {
          existing[prop] = triggers
        } else {
          stash[id] = { [prop]: triggers}
        }
      },

      find (changed) {
        return Object.entries(stash).reduce((ret, [id, item]) => {
          const props = Object.keys(item).filter(key => {
            return changed.some(change => item[key].includes(change))
          })
          if (props.length) ret[id] = props
          return ret
        }, {})
      }
    }
  }

}
