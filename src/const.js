
export default {
  attrs: {
    id: 'hp-id',
    hotAttr: 'hp-attrs'
  },

  regex: {
    ejs: {
      isDynamicAttr (value) {
        return /<%.*%>/.test(value)
      },
      cleanAttr (value) {
        return value.replace(/<%=(.*)%>/, (full, key) => key.trim())
      },
      cleanup (html) {
        return html.replace(/%&gt;/g, '%>').replace(/&lt;%/g, '<%').replace(/=&gt;/g, '=>')
      }
    }
  }
}
