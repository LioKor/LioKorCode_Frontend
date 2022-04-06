// To have var "ot" in global scope
// you need to include "ot" firstly

/*
 *    /\
 *   /  \ Addon AceEditorAdapter for library "ot 0.0.14" (http://operational-transformation.github.com)
 *  /    \ Written by Sergey Tyapkin (https://github.com/SergTyapkin)
 * /      \
 * \      / Based on CodeMirrorAdapter from "ot" lib that was written by Tim Baumann (http://timbaumann.info)
 *  \    /
 *   \  / (c) 2022 Sergey Tyapkin
 *    \/ This addon may be freely distributed under the MIT license.
 */
ot.AceEditorAdapter = (function (global) {
    'use strict';

    var TextOperation = ot.TextOperation;
    var Selection = ot.Selection;

    function AceEditorAdapter (ae) {
        this.ae = ae;
        this.aeElement = ae.renderer.container;

        this.ignoreNextChange = false;
        this.changeInProgress = false;
        this.selectionChanged = false;

        this.updateAceEditorSizes();

        this.markersElement = document.createElement('div');
        this.markersElement.id = 'ot-ace-addon-markers';
        this.markersElement.style.position = 'absolute';
        this.markersElement.style.inset = '0';
        this.markersElement.style.left = this.LEFT_MARGIN + 'px';
        this.aeElement.querySelector('.ace_scroller').appendChild(this.markersElement);

        bind(this, 'onChange');
        bind(this, 'onCursorActivity');
        bind(this, 'onFocus');
        bind(this, 'onBlur');
        bind(this, 'onScrollVertical');

        ae.on('change', this.onChange);
        ae.on('changeSelection', this.onCursorActivity);
        ae.on('focus', this.onFocus);
        ae.on('blur', this.onBlur);
        ae.session.on('changeScrollTop', this.onScrollVertical);
    }

    AceEditorAdapter.prototype.updateAceEditorSizes = function () {
        this.LINE_HEIGHT = this.aeElement.querySelector('.ace_line').scrollHeight;
        this.LEFT_MARGIN = Number(this.aeElement.querySelector('.ace_text-layer').style.getPropertyValue('margin-left').replace(/px$/, ''));

        // To get symbol width in current monospace(!) font we need
        // to create new element inside .ace_editor (root element)
        // with 1 character and measure it's width
        var el = document.createElement('span');
        el.innerText = 'x';
        el.style.visibility = 'hidden';
        this.aeElement.appendChild(el); // append el to root el
        this.SYMBOL_WIDTH = el.offsetWidth; // measure width
        el.remove(); // remove el
    }

    // Removes all event listeners from the AceEditor instance.
    AceEditorAdapter.prototype.detach = function () {
        this.markersElement.remove();

        this.ae.off('change', this.onChange);
        this.ae.off('changeSelection', this.onCursorActivity);
        this.ae.off('focus', this.onFocus);
        this.ae.off('blur', this.onBlur);
        this.ae.session.off('changeScrollTop', this.onScrollVertical);
    };

    function cmpPos (a, b) {
        if (a.line < b.line) { return -1; }
        if (a.line > b.line) { return 1; }
        if (a.ch < b.ch)     { return -1; }
        if (a.ch > b.ch)     { return 1; }
        return 0;
    }
    function posEq (a, b) { return cmpPos(a, b) === 0; }
    function posLe (a, b) { return cmpPos(a, b) <= 0; }

    function minPos (a, b) { return posLe(a, b) ? a : b; }
    function maxPos (a, b) { return posLe(a, b) ? b : a; }

    // Converts a AceEditor change (as returned
    // by the 'change' event in AceEditor) into a
    // TextOperation and its inverse and returns them as a two-element array.
    AceEditorAdapter.operationFromAceEditorChanges = function (change, doc) {
        // Approach: Replay the changes, beginning with the most recent one, and
        // construct the operation and its inverse.

        var docEndLength = doc.getValue().length;
        var operation    = new TextOperation().retain(docEndLength);
        var inverse      = new TextOperation().retain(docEndLength);

        var positionToIndex = function (pos) {
            return doc.session.doc.positionToIndex(pos);
        };

        function last (arr) { return arr[arr.length - 1]; }

        function sumLengths (strArr) {
            if (strArr.length === 0) { return 0; }
            var sum = 0;
            for (var i = 0; i < strArr.length; i++) { sum += strArr[i].length; }
            return sum + strArr.length - 1;
        }

        var fromIndex = positionToIndex(change.start);
        var restLength = docEndLength - fromIndex;

        if (change.action === 'insert') {
            restLength -= sumLengths(change.lines);

            operation = new TextOperation()
                .retain(fromIndex)
                .insert(change.lines.join('\n'))
                .retain(restLength)
                .compose(operation);

            inverse = inverse.compose(new TextOperation()
                .retain(fromIndex)
                ['delete'](sumLengths(change.lines))
                .retain(restLength)
            );
        } else if (change.action === 'remove') {
            operation = new TextOperation()
                .retain(fromIndex)
                ['delete'](sumLengths(change.lines))
                .retain(restLength)
                .compose(operation);

            inverse = inverse.compose(new TextOperation()
                .retain(fromIndex)
                .insert(change.lines.join('\n'))
                .retain(restLength)
            );
        }

        return [operation, inverse];
    };

    // Singular form for backwards compatibility.
    AceEditorAdapter.operationFromAceEditorChange =
        AceEditorAdapter.operationFromAceEditorChanges;

    // Apply an operation to a AceEditor instance.
    AceEditorAdapter.applyOperationToAceEditor = function (operation, ae) {
        var ops = operation.ops;
        var index = 0; // holds the current index into AceEditor's content
        for (var i = 0, l = ops.length; i < l; i++) {
            var op = ops[i];
            if (TextOperation.isRetain(op)) {
                index += op;
            } else if (TextOperation.isInsert(op)) {
                var to = ae.session.doc.indexToPosition(index);
                ae.session.doc.insert(to, op);
                index += op.length;
            } else if (TextOperation.isDelete(op)) {
                var from = ae.session.doc.indexToPosition(index);
                var to   = ae.session.doc.indexToPosition(index - op);
                ae.session.doc.remove(new ace.Range(from.row, from.column, to.row, to.column));
            }
        }
    };

    AceEditorAdapter.prototype.registerCallbacks = function (cb) {
        this.callbacks = cb;
    };

    AceEditorAdapter.prototype.onChange = function (change) {
        this.changeInProgress = true;
        if (!this.ignoreNextChange) {
            var pair = AceEditorAdapter.operationFromAceEditorChanges(change, this.ae);
            this.trigger('change', pair[0], pair[1]);
        }
        if (this.selectionChanged) { this.trigger('selectionChange'); }
        this.changeInProgress = false;
        this.ignoreNextChange = false;
    };

    AceEditorAdapter.prototype.onFocus =
        AceEditorAdapter.prototype.onCursorActivity =
            function () {
                if (this.changeInProgress) {
                    this.selectionChanged = true;
                } else {
                    this.trigger('selectionChange');
                }
            };

    AceEditorAdapter.prototype.onBlur = function () {
        if (this.ae.selection.isEmpty()) { this.trigger('blur'); }
    };

    AceEditorAdapter.prototype.onScrollVertical = function (scroll) {
        this.markersElement.style.top = -scroll + 'px';
    };


    AceEditorAdapter.prototype.getValue = function () {
        return this.ae.getValue();
    };

    AceEditorAdapter.prototype.getSelection = function () {
        var ae = this.ae;

        var selectionList = ae.selection.getAllRanges();
        var ranges = [];
        for (var i = 0; i < selectionList.length; i++) {
            var sel = selectionList[i];
            ranges[i] = new Selection.Range(
                ae.session.doc.positionToIndex({row: sel.start.row, column: sel.start.column}),
                ae.session.doc.positionToIndex({row: sel.end.row, column: sel.end.column})
            );
        }

        return new Selection(ranges);
    };

    AceEditorAdapter.prototype.setSelection = function (selection) {
        this.ae.selection.clearSelection();
        for (var i = 0; i < selection.ranges.length; i++) {
            var range = selection.ranges[i];
            var {row: sR, column: sC} = this.ae.session.doc.indexToPosition(range.anchor);
            var {row: eR, column: eC} = this.ae.session.doc.indexToPosition(range.head);
            this.ae.selection.addRange(new ace.Range(sR, sC, eR, eC));
        }
    };

    AceEditorAdapter.prototype.setOtherCursor = function (position, color, clientId) {
        var cursorPos = this.ae.session.doc.indexToPosition(position);
        var scrollTop = this.ae.session.getScrollTop();
        var cursorEl = document.createElement('span');
        cursorEl.className = 'other-client';
        cursorEl.style.display = 'inline-block';
        cursorEl.style.padding = '0';
        cursorEl.style.marginLeft = cursorEl.style.marginRight = '-1px';
        cursorEl.style.borderLeftWidth = '2px';
        cursorEl.style.borderLeftStyle = 'solid';
        cursorEl.style.borderLeftColor = color;
        cursorEl.style.zIndex = 0;
        cursorEl.style.position = 'absolute';
        cursorEl.style.pointerEvents = 'none';
        cursorEl.style.height = this.LINE_HEIGHT + 'px';
        cursorEl.style.top = this.LINE_HEIGHT * cursorPos.row + 'px';
        cursorEl.style.left = this.SYMBOL_WIDTH * cursorPos.column + this.LEFT_MARGIN + 'px';
        cursorEl.setAttribute('data-clientid', clientId);
        this.markersElement.appendChild(cursorEl);
        return cursorEl;
    };

    AceEditorAdapter.prototype.setOtherSelectionRange = function (range, color, clientId) {
        //var match = /^#([0-9a-fA-F]{6})$/.exec(color);
        //if (!match) { throw new Error("only six-digit hex colors are allowed."); }

        var anchorPos = this.ae.session.doc.indexToPosition(range.anchor);
        var headPos   = this.ae.session.doc.indexToPosition(range.head);

        var selEl = document.createElement('span');
        selEl.className = 'other-client';
        selEl.style.display = 'inline-block';
        selEl.style.padding = '0';
        selEl.style.background = color;
        selEl.style.zIndex = 0;
        selEl.style.position = 'absolute';
        selEl.style.top = selEl.style.left = selEl.style.right = selEl.style.bottom = 0;
        selEl.style.pointerEvents = 'none';
        selEl.style.opacity = '0.3';
        selEl.setAttribute('data-clientid', clientId);
        var clipPathStart = `path('M ${this.SYMBOL_WIDTH * anchorPos.column} ${this.LINE_HEIGHT * anchorPos.row}` +
            `v ${this.LINE_HEIGHT}`;
        var clipPathEnd = `L ${this.SYMBOL_WIDTH * headPos.column} ${this.LINE_HEIGHT * headPos.row + this.LINE_HEIGHT} v ${-this.LINE_HEIGHT}  Z')`;
        for (var i = anchorPos.row + 1; i < headPos.row + 1; i++) {
            clipPathStart += `h 10000 v ${-this.LINE_HEIGHT} ` +
                `M 0 ${this.LINE_HEIGHT * i} v ${this.LINE_HEIGHT}`;
        }
        selEl.style.clipPath = clipPathStart + clipPathEnd;
        this.markersElement.appendChild(selEl);
        return selEl;
    };

    AceEditorAdapter.prototype.setOtherSelection = function (selection, color, clientId) {
        var selectionObjects = [];
        for (var i = 0; i < selection.ranges.length; i++) {
            var range = selection.ranges[i];
            if (range.isEmpty()) {
                selectionObjects[i] = this.setOtherCursor(range.head, color, clientId);
            } else {
                selectionObjects[i] = this.setOtherSelectionRange(range, color, clientId);
            }
        }
        return {
            clear: function () {
                for (var i = 0; i < selectionObjects.length; i++) {
                    selectionObjects[i].remove(); // Remove old HTML elements
                }
            }
        };
    };

    AceEditorAdapter.prototype.trigger = function (event) {
        var args = Array.prototype.slice.call(arguments, 1);
        var action = this.callbacks && this.callbacks[event];
        if (action) { action.apply(this, args); }
    };

    AceEditorAdapter.prototype.applyOperation = function (operation) {
        this.ignoreNextChange = true;
        AceEditorAdapter.applyOperationToAceEditor(operation, this.ae);
    };

    AceEditorAdapter.prototype.registerUndo = function (undoFn) {
        this.ae.undo = undoFn;
    };

    AceEditorAdapter.prototype.registerRedo = function (redoFn) {
        this.ae.redo = redoFn;
    };

    // Throws an error if the first argument is falsy. Useful for debugging.
    function assert (b, msg) {
        if (!b) {
            throw new Error(msg || "assertion error");
        }
    }

    // Bind a method to an object, so it doesn't matter whether you call
    // object.method() directly or pass object.method as a reference to another
    // function.
    function bind (obj, method) {
        var fn = obj[method];
        obj[method] = function () {
            fn.apply(obj, arguments);
        };
    }

    return AceEditorAdapter;

}(this));
