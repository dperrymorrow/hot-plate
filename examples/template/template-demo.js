import Template from "../src/template.js"
const tpl = document.getElementById("template").innerHTML
const data = {
  items: [
    {id: 1, title: 'foo' },
    {id: 2, title: 'bar' },
    {id: 3, title: 'foo' , skills: ["css", "html"]},
  ],
  name: 'Dave',
  newName: '',
  highlightIfDavid () {
    return this.name === 'Dave' ? 'highlight' : ''
  }
}

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

console.log(data)

document.getElementById("app").innerHTML = Template(tpl, data)
