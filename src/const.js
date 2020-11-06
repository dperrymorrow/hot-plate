
export default {
  attrs: {
    item: 'live-item',
    group: 'live-group',
    itemId: 'item-id',
    groupId: 'group-id'
  },
  regex: {
    item: /<.+(live-item)/gm,
    group: /<.+(live-group)/gm
  }
}
