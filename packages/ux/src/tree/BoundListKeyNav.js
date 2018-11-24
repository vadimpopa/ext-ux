/**
 * Created by vadim on 20/11/2018.
 */
Ext.define('Ext.ux.tree.BoundListKeyNav', {
    extend: 'Ext.tree.NavigationModel',

    alias: 'view.navigation.treeBoundList',

    requires: [
        'Ext.util.KeyNav'
    ],

    initKeyNav(view) {
        if (!this.keyNav) {
            this.callParent(arguments);
        }

        const field = view.pickerField;

        // BoundLists must be able to function standalone with no bound field
        if (!field) {
            return;
        }

        if (!field.rendered) {
            field.on('render', Ext.Function.bind(this.initKeyNav, this, [view], 0), this, {single: true});
            return;
        }

        // BoundListKeyNav also listens for key events from the field to which it is bound.
        this.fieldKeyNav = new Ext.util.KeyNav({
            disabled: true,
            target: field.inputEl,
            forceKeyDown: true,
            up: this.onFieldKeyUp,
            down: this.onFieldKeyDown,
            // right: me.onKeyRight,
            // left: me.onKeyLeft,
            // pageDown: me.onKeyPageDown,
            // pageUp: me.onKeyPageUp,
            // home: me.onKeyHome,
            // end: me.onKeyEnd,
            tab: this.onFieldKeyTab,
            // space: me.onKeySpace,
            enter: this.onFieldKeyEnter,
            // A: {
            //     ctrl: true,
            //     // Need a separate function because we don't want the key
            //     // events passed on to selectAll (causes event suppression).
            //     handler: me.onSelectAllKeyPress
            // },
            // This object has to get its key processing in first.
            // Specifically, before any Editor's key hyandling.
            priority: 1001,
            scope: this
        });
    },

    onFieldKeyTab(e) {
        var view = this.view,
            field = view.pickerField;

        if (view.isVisible()) {
            if (field.selectOnTab) {
                this.selectHighlighted(e);
            }

            if (field.collapse) {
                field.collapse();
            }
        }

        // Tab key event is allowed to propagate to field
        return true;
    },

    /**
     * @private
     *
     */
    onFieldKeyUp(e) {
        var me = this,
            boundList = me.view,
            allItems = boundList.all,
            oldItem = boundList.highlightedItem,
            oldItemIdx = oldItem ? boundList.indexOf(oldItem) : -1,
            newItemIdx = oldItemIdx > 0 ? oldItemIdx - 1 : allItems.getCount() - 1; //wraps around

        me.setPosition(newItemIdx);

        // Stop this from moving the cursor in the field
        e.preventDefault();
    },

    /**
     * @private
     *
     */
    onFieldKeyDown(e) {
        var me = this,
            boundList = me.view,
            allItems = boundList.all,
            oldItem = boundList.highlightedItem,
            oldItemIdx = oldItem ? boundList.indexOf(oldItem) : -1,
            newItemIdx = oldItemIdx < allItems.getCount() - 1 ? oldItemIdx + 1 : 0; //wraps around

        me.setPosition(newItemIdx);

        // Stop this from moving the cursor in the field
        e.preventDefault();
    },

    onFieldKeyEnter: function (e) {
        var view = this.view,
            selModel = view.getSelectionModel(),
            field = view.pickerField,
            count = selModel.getCount();
        // Stop the keydown event so that an ENTER keyup does not get delivered to
        // any element which focus is transferred to in a select handler.
        e.stopEvent();
        this.selectHighlighted(e);
        // Handle the case where the highlighted item is already selected
        // In this case, the change event won't fire, so just collapse
        if (!field.multiSelect && count === selModel.getCount() && field.collapse) {
            field.collapse();
        }
        // Stop propagation of the ENTER keydown event so that any Editor which owns the field
        // does not completeEdit, but we also need to still fire the specialkey event for ENTER,
        // so lets add fromBoundList to eOpts, and this will be handled by CellEditor#onSpecialKey.
        field.fireEvent('specialkey', field, e, {
            fromBoundList: true
        });
        return false;
    },

    /**
     * Triggers selection of the currently highlighted item according to the behavior of
     * the configured SelectionModel.
     */
    selectHighlighted: function (e) {
        var me = this,
            boundList = me.view,
            selModel = boundList.getSelectionModel(),
            highlightedRec,
            highlightedPosition = me.recordIndex;
        // If all options have been filtered out, then do NOT add most recently highlighted.
        if (boundList.all.getCount()) {
            highlightedRec = me.getRecord();
            if (highlightedRec) {
                // Select if not already selected.
                // If already selected, selecting with no CTRL flag will deselect the record.
                if (e.getKey() === e.ENTER || !selModel.isSelected(highlightedRec)) {
                    selModel.selectWithEvent(highlightedRec, e);
                    // If the result of that selection is that the record is removed or filtered out,
                    // jump to the next one.
                    if (!boundList.store.data.contains(highlightedRec)) {
                        me.setPosition(Math.min(highlightedPosition, boundList.store.getCount() - 1));
                    }
                }
            }
        }
    },

    enable: function () {
        this.fieldKeyNav.enable();
        this.callParent();
    },

    disable: function () {
        this.fieldKeyNav.disable();
        this.callParent();
    },

    onKeyEsc: function() {
        this.callParent();

        if (this.view.pickerField) {
            this.view.pickerField.collapse();
        }
    },

    destroy: function() {
        this.fieldKeyNav = Ext.destroy(this.fieldKeyNav);
        this.callParent();
    }
});