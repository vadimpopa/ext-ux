/**
 * Created by vadim on 22/11/2018.
 */
Ext.define('Ext.ux.tree.BoundList', {
    extend: 'Ext.tree.Panel',

    requires: [
        'Ext.tree.Column',
        'Ext.ux.tree.BoundListKeyNav'
    ],

    reserveScrollbar: true,
    useArrows: true,
    rootVisible: false,
    multiSelect: false,
    singleExpand: false,
    animate: false,
    focusOnToFront: false,
    floating: true,
    hidden: true,

    loadMask: true,
    loadingText: 'Loading...',

    initComponent() {
        this.viewConfig = Ext.apply(this.viewConfig || {}, {
            navigationModel: 'treeBoundList'
        });

        this.callParent();
        
        this.on('celldblclick', function (view, cell, cellIndex, record, row, rowIndex, e) {
            view.selModel.selectWithEvent(record, e);
        });
    },

    createMask: function (mask) {
        var me = this,
            maskStore = me.getStore(),
            cfg;

        if (maskStore && !maskStore.isEmptyStore && !maskStore.loadsSynchronously()) {
            cfg = {
                target: me,
                msg: me.loadingText,
                useMsg: me.loadingUseMsg,
                // The store gets bound in initComponent, so while
                // rendering let's push on the store
                store: maskStore
            };
            // Do not overwrite default msgCls if we do not have a loadingCls
            if (me.loadingCls) {
                cfg.msgCls = me.loadingCls;
            }
            // either a config object
            if (Ext.isObject(mask)) {
                cfg = Ext.apply(cfg, mask);
            }
            // Attach the LoadMask to a *Component* so that it can be sensitive to resizing during long loads.
            // If this DataView is floating, then mask this DataView.
            // Otherwise, mask its owning Container (or this, if there *is* no owning Container).
            // LoadMask captures the element upon render.
            me.loadMask = new Ext.LoadMask(cfg);
            me.loadMask.on({
                scope: me,
                beforeshow: me.onMaskBeforeShow,
                hide: me.onMaskHide
            });
        }
        return me.loadMask;
    },

    onMaskBeforeShow: function () {
        var me = this,
            loadingHeight = me.loadingHeight;

        if (loadingHeight && loadingHeight > me.getHeight()) {
            me.hasLoadingHeight = true;
            me.oldMinHeight = me.minHeight;
            me.minHeight = loadingHeight;
            me.updateLayout();
        }
    },

    onMaskHide: function () {
        var me = this;

        if (!me.destroying && me.hasLoadingHeight) {
            me.minHeight = me.oldMinHeight;
            me.updateLayout();
            delete me.hasLoadingHeight;
        }
    },

    onRender() {
        var mask = this.loadMask;

        this.callParent();

        if (mask) {
            this.createMask(mask);
        }
    }
});