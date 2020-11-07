
export default {
  outlet: /<%=(.*)%>/,

  cleanup: [
    {search: /%&gt;/g, replace: '%>'},
    {search: /&lt;%/g, replace: '<%'},
    {search: /=&gt;/g, replace: '=>'}
  ]

}
