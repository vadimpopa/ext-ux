# TreeCombobox Fiddle:

https://fiddle.sencha.com/#view/editor&fiddle/2juh

```javascript
{
  xclass: 'Ext.ux.form.field.TreeCombobox',
  reference: 'categoryField',
  anchor: '50%',
  margin: 0,
  labelAlign: 'top',
  name: 'newCat',

  displayField: 'text',
  valueField: 'text',

  allowBlank: false,
  allowOnlyWhitespace: false,
  anyMatch: true,
  typeAhead: true,
  forceSelection: true,

  queryMode: 'local',
  store: {
      model: 'Fiddle.model.Category',
      type: 'tree',
      filterer: 'bottomup',
      remoteFilter: false,
      remoteSort: false,
      root: {
          text: 'root',
          expanded: true
      }
  }
}
```
