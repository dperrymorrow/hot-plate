
export default function (ejs) {
  return {
    render: ejs.render,

    outlet: /<%=\s*([^<% ]+)\s*%>/gm,
    iterate: /<%[\s]*?([a-z0-9$_]+).forEach\([\(\s]*?([a-z0-9$_]+)[\s,]*([a-z0-9$_]+)/gm,

    cleanup: [
      { search: /%&gt;/g, replace: '%>' },
      { search: /&lt;%/g, replace: '<%' },
      { search: /=&gt;/g, replace: '=>' }
    ]
  }
}
