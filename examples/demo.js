
import HotPlate from '../src/index.js'
import EjsParser from '../src/parsers/ejs.js'

const inputData = {
  items: [
    { id: 1, title: 'foo' },
    { id: 2, title: 'bar' },
    { id: 3, title: 'foo' }
  ],
  name: 'Dave',
  newName: '',
  highlightIfDavid () {
    return this.name === 'Dave' ? 'highlight' : ''
  }
}

const { template, data } = HotPlate.app({
  template: Array(100).fill(document.getElementById('demo-template').innerHTML).join('\n'),
  data: inputData,
  engine: EjsParser(window.ejs),
  $el: document.getElementById('app'),
  trace: true
})

window.app = {
  handlers: {
    changeName (ev) {
      data.name = ev.target.value
    },
    remove (id) {
      const index = data.items.findIndex(item => item.id === id)
      data.items.splice(index, 1)
    },
    add () {
      const ids = data.items.map(item => item.id)
      if (!ids.length) ids.push(0)
      const nextId = Math.max(...ids) + 1

      data.items.push({ id: nextId, title: data.newName })
      data.newName = ''
    },
    changeNewName (ev) {
      data.newName = event.target.value
    }
  }
}
