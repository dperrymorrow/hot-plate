
import Template from '../src/template.js'

const inputData = {
  items: [
    {id: 1, title: 'foo' },
    {id: 2, title: 'bar' },
    {id: 3, title: 'foo' }
  ],
  name: 'Dave',
  newName: '',
  highlightIfDavid () {
    return name === 'Dave' ? 'highlight' : ''
  }
}

const tpl = document.getElementById('demo-template').innerHTML

const {html, data} = Template(
  tpl,
  inputData
)

document.getElementById('app').innerHTML = html
//
// window.app = {
//   handlers: {
//     changeName (ev) {
//       data.name = ev.target.value
//     },
//     remove (id) {
//       const index = data.items.findIndex(item => item.id === id)
//       data.items.splice(index, 1)
//     },
//     add () {
//       const ids = data.items.map(item => item.id)
//       if (!ids.length) ids.push(0)
//       const nextId = Math.max(...ids) + 1
//
//       data.items.push({id: nextId, title: data.newName})
//       data.newName = ''
//     },
//     changeNewName (ev) {
//       data.newName = event.target.value
//     }
//   }
// }
