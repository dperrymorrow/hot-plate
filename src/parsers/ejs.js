
export default {
  outlet: /<%=\s*([^<% ]+)\s*%>/gm,
  iterate: /<%\s*(.*).forEach\s*\(/gm,

  cleanup: [
    {search: /%&gt;/g, replace: '%>'},
    {search: /&lt;%/g, replace: '<%'},
    {search: /=&gt;/g, replace: '=>'}
  ]
}
