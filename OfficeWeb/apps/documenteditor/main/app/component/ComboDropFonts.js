﻿/*
 * (c) Copyright Ascensio System SIA 2010-2014
 *
 * This program is a free software product. You can redistribute it and/or 
 * modify it under the terms of the GNU Affero General Public License (AGPL) 
 * version 3 as published by the Free Software Foundation. In accordance with 
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect 
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied 
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For 
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia,
 * EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under 
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */
 Ext.define("DE.component.ComboDropFonts", {
    extend: "Ext.form.field.ComboBox",
    alias: "widget.decombodropfonts",
    queryMode: "local",
    matchFieldWidth: false,
    displayField: "name",
    showlastused: false,
    listeners: {
        expand: function (picker) {
            var combo = this;
            var plugin = combo.getPlugin("scrollpane");
            if (plugin) {
                var doScroll = new Ext.util.DelayedTask(function () {
                    var node = combo.picker.getNode(combo.lastSelection[0]);
                    if (node) {
                        plugin.scrollToElement(node, false, false);
                    }
                });
            }
            doScroll.delay(10);
        }
    },
    constructor: function (config) {
        var me = this;
        me.iconHeight = FONT_THUMBNAIL_HEIGHT;
        me.iconWidth = 302;
        this.addEvents("createpicker");
        var item_tpl = Ext.create("Ext.XTemplate", '<tpl for=".">', '<a class="font-item" style="display: block;">', '<img id="{[Ext.id()]}" src="{[this.getImageUri(values)]}" width="{[this.getImageWidth()]}" height="{[this.getImageHeight()]}" style="vertical-align: middle;margin: 0 0 0 -10px;">', "</a>", "</tpl>", {
            getImageUri: function (opts) {
                if (opts.cloneid) {
                    return me.picker.listEl.down("#" + opts.cloneid).dom.src;
                }
                var thumb = document.createElement("canvas");
                thumb.width = me.spriteThumbs.width;
                thumb.height = me.iconHeight;
                var ctx = thumb.getContext("2d");
                ctx.save();
                ctx.translate(0, -FONT_THUMBNAIL_HEIGHT * opts.imgidx);
                ctx.drawImage(me.spriteThumbs, 0, 0);
                ctx.restore();
                return thumb.toDataURL();
            },
            getImageWidth: function () {
                return me.iconWidth;
            },
            getImageHeight: function () {
                return me.iconHeight;
            }
        });
        Ext.apply(config, {
            listConfig: {
                id: (Ext.isDefined(config.listId)) ? config.listId : "combo-fonts-list",
                emptyText: "no fonts found",
                mode: "local",
                width: 326,
                maxHeight: 468,
                height: 468,
                minHeight: 150,
                itemTpl: item_tpl,
                blockRefresh: true,
                listeners: {
                    viewready: function (cmp) {
                        me.spriteThumbs = undefined;
                    }
                }
            }
        });
        this.initConfig(config);
        this.callParent(arguments);
        return this;
    },
    initComponent: function () {
        this.addListener("beforequery", this._beforeQuery, this);
        this.callParent(arguments);
    },
    onRender: function (cmp) {
        this.callParent(arguments);
        this.el.set({
            "data-qtip": this.tooltip
        });
        this.validate();
    },
    createPicker: function () {
        this.callParent(arguments);
        if (this.showlastused) {
            this.fireEvent("createpicker", this, this.picker);
        }
        return this.picker;
    },
    fillFonts: function (arr) {
        this._loadSprite();
        if (this.getStore().getCount()) {
            var rec = this.getStore().findRecord("name", "Times New Roman");
            if (rec) {
                this.select(rec);
            } else {
                this.select(this.getStore().getAt(0));
            }
        }
    },
    _loadSprite: function () {
        var me = this;
        me.spriteThumbs = new Image();
        me.spriteThumbs.src = window.g_standart_fonts_thumbnail;
    },
    _beforeQuery: function (qe) {
        qe.forceAll = true;
        qe.cancel = true;
        if (qe.combo) {
            qe.combo.expand();
            var picker = qe.combo.getPicker();
            var index = qe.combo.store.find("name", qe.query);
            if (! (index < 0)) {
                var node = picker.getNode(qe.combo.store.getAt(index));
                if (node) {
                    picker.highlightItem(node);
                    var pos_h = picker.listEl.getHeight() / 2 - 30;
                    var list_t = picker.listEl.getTop();
                    var offset_y = Ext.get(node).getY() - list_t - pos_h;
                    if (Math.abs(offset_y) > pos_h) {
                        var jsp = $("#" + picker.listEl.id).data("jsp");
                        if (jsp) {
                            jsp.scrollByY(offset_y, true);
                        }
                    }
                }
            } else {
                $("#" + picker.id + " ." + picker.overItemCls).removeClass(picker.overItemCls);
            }
        }
    }
});