
const engine = function (html, options) {
  const outlet = /<%=([^<%]+)?%>/gm
  const expression = /<%(.*)?%>/

  let code = 'const r=[];\n'
  let inExpression = false

  const lines = html.replace(outlet, (match, js) => {
    return '${' + js.trim() + '}'
  }).split('\n').map(line => {
    const str = line.trim()
    if (!str.length) return
    if (expression.test(str)) {

      code += inExpression ? "r.push('</span>')\n" : "r.push('<span expression>')\n"
      code += str.replace(expression, (match, js) => js.trim() )
      inExpression = !inExpression
    } else {
      code += 'r.push(`' + str + '`)'
    }
    code += "\n"
  })

  code += 'return r.join("")'
  let fn

  try {
    fn = new Function(code)
  } catch (err) {
    console.error(err)
    console.log(code)
    // throw (err)
  }

  return fn.apply(options)
}

export default engine
