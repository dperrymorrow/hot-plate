
import HotPlate from '../src/index.js'

const inputData = {
  items: [
    {id: 1, title: 'foo' },
    {id: 2, title: 'bar' },
    {id: 3, title: 'foo' },
    {id: 4, title: 'bar' },
    {id: 5, title: 'foo' },
    {id: 6, title: 'bar' },
    {id: 7, title: 'foo' },
    {id: 8, title: 'bar' },
    {id: 9, title: 'foo' },
    {id: 10, title: 'bar' },
    {id: 11, title: 'foo' },
    {id: 12, title: 'bar' },
    {id: 13, title: 'foo' },
    {id: 14, title: 'bar' },
    {id: 15, title: 'foo' },
    {id: 16, title: 'bar' }
  ],
  name: 'Dave',
  newName: '',
  highlightIfDavid () {
    return this.name === 'Dave' ? 'highlight' : ''
  }
}

const {data, template} = LiveJs({
  template: document.getElementById('demo-template').innerHTML,
  data: inputData,
  render: ejs.render,
  $target: document.getElementById('app'),
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

      data.items.push({id: nextId, title: data.newName})
      data.newName = ''
    },
    changeNewName (ev) {
      data.newName = event.target.value
    }
  }
}
