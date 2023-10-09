/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */
/*
CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';
};
https://ckeditor.com/latest/samples/toolbarconfigurator/index.html#basic
여기서 config.js에 안에 넣을 거 설정 가능
pdf는 안 쓰는 그룹 다 지우면 자동으로 따라감
 */
CKEDITOR.editorConfig = function( config ) {
    config.toolbarGroups = [
        '/',
        { name: 'forms', groups: [ 'forms' ] },
        { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
        { name: 'links', groups: [ 'links' ] },
        { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
        { name: 'insert', groups: [ 'insert' ] },
        { name: 'styles', groups: [ 'styles' ] },
        { name: 'colors', groups: [ 'colors' ] },
        { name: 'tools', groups: [ 'tools' ] },
    ];
    config.removePlugins = 'resize';
    // 이걸로 크기 뱐걍 창 지우기 가능

    config.removeButtons = 'Save,NewPage,Preview,Print,Templates,Cut,Copy,Paste,PasteText,PasteFromWord,Redo,Undo,Find,Replace,SelectAll,Scayt,ShowBlocks,About,CopyFormatting,Unlink,Anchor,Iframe,PageBreak,BidiLtr,BidiRtl,Language,CreateDiv,Flash,TextField,RemoveFormat,Form,ImageButton,Button';
};