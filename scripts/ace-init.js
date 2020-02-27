let editor = ace.edit('editorBlock');
editor.setOptions({
    fontSize: '12pt',
});

//editor.setTheme('ace/theme/dawn');
editor.session.setMode('ace/mode/javascript');

editor.setValue(`function sum(a, b) {
}`);
editor.gotoLine(2); 
editor.navigateLineEnd();
editor.focus();