/**
 * Created by vadim on 20/11/2018.
 */
Ext.define('Ext.ux.selection.ComboTreeModel', {
    extend: 'Ext.selection.TreeModel',

    onNavigate: function (e) {
        var key = e.keyEvent.getKey(),
            isUpDown = key === e.keyEvent.UP || key === e.keyEvent.DOWN;

        if (!isUpDown) {
            return this.callParent(arguments);
        } else {
            if (e.record) {
                this.view.highlightItem(this.view.getNodeByRecord(e.record));
            }
        }
    }
});