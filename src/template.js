
import ProxyTrap from './proxy-trap.js'

const engine = function (template, data) {
  const outlet = /<%=([^<%]+)?%>/gm
  const expression = /<%(.*)?%>/

  const trap = ProxyTrap.create(data)

  let code =
`
const r=[];
let ${Object.keys(data).map(key => `${key} = this.${key}`).join(', ')};
const _traverse = (path, data) => {
  return path.split('.').reduce((pointer, seg) => {
    return pointer[seg]
  }, this)
};
function $register(path) {
  try {
    return _traverse(path)
  } catch(err) {
    console.error("path not found:", path)
    return ""
  }
}

`

  let inExpression = false

  const lines = template.replace(outlet, (match, js) => {
    const path = js.trim()
    return path.endsWith(')') ? '${' + path + '}' : '${$register("' + path + '")}'
  }).split('\n').map(line => {
    const str = line.trim()
    if (!str.length) return

    if (expression.test(str)) {
      code += str.replace(expression, (match, js) => js.trim())
      inExpression = !inExpression
    } else {
      if (inExpression) code += '  '
      code += 'r.push(`' + str + '`);'
    }
    code += '\n'
  })

  code += 'return r.join("")'
  let fn

  try {
    fn = new Function(code)
  } catch (err) {
    console.error(err)
    console.log(code)
  }

  document.getElementById('template-output').innerHTML = Prism.highlight(code, Prism.languages.javascript, 'javascript')

  return {html: fn.apply(data), data: trap}
}

export default engine
