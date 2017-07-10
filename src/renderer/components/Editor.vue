<template>
    <div id="wrapper" @mousemove="mousemove" @drop.prevent="ondrop" @keyup.ctrl.83="onsave">
        <textarea :value="input" @input="update" class="text-area" @keydown.tab.prevent="onTab"
                  :style="{width:editorWidth}"></textarea>
        <div class="split-bar" @mousedown="mousedown" @mouseup="mouseup">
            <div class="split-line"/>
        </div>
        <div v-html="compiledMarkdown" class="render-area" tabindex="1"></div>
    </div>
</template>

<script>
    let marked = require('marked');
    import 'highlight.js/styles/googlecode.css' //样式文件
    let fs = require('fs');
    marked.setOptions({
        renderer: new marked.Renderer(),
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: false,
        smartLists: true,
        smartypants: false,
        highlight: function (code, lang) {
            return require('highlight.js').highlightAuto(code).value;
        }
    });
    console.log(marked('```I am using __markdown__.```'));

    export default {
        name: 'landing-page',
        data: function () {
            return {
                editorWidth: "50%",
                input: "123",
                dragging: false,
                filePath: ''
            }
        },
        methods: {
            open (link) {
                this.$electron.shell.openExternal(link)
            },
            renderMessage(){
                return marked('I am using __markdown__.')
            },
            update: function (e) {
                this.input = e.target.value
            },
            onTab(event){
                this.input = this.input + "\t"
            },
            mousedown(event){
                this.dragging = true;
            },
            mouseup(event){
                this.dragging = false;
            },
            mousemove(event){
                //1左键，2中键，3右键
//                1 == event.which
                if (this.dragging) {
                    this.editorWidth = event.x + event.movementX - 1 + "px"
                }
            },
            ondrop(event){
                let fileList = event.dataTransfer.files;
                console.info(123, fileList)
                // 总得拖一个文件吧
                if (fileList.length === 0 || fileList.length > 1) {
                    return false
                }
                let file = fileList[0];
                if (file.type != 'text/markdown') {
                    return false
                }
//                name path lastModified lastModifiedDate size
                fs.readFile(file.path, 'utf8', (error, data) => {
                    this.input = data
                    this.filePath = file.path
                    document.title = file.name
                })

            },
            onsave(){
                console.info('save')
                if (this.filePath) {
                    fs.writeFile(this.filePath, this.input, (error) => {
                        console.info(error)
                    })
                }
            },
            preventDefaultEvent (eventName) {
                document.addEventListener(eventName, function (e) {
                    e.preventDefault();
                }, false)
            },
        },
        computed: {
            compiledMarkdown: function () {
                return marked(this.input, {sanitize: true})
            }
        },
        mounted () {
            // 阻止浏览器默认的拖拽时事件，测试阻止这几个就够了，不放心就全阻止一遍吧
            ['dragleave', 'drop', 'dragenter', 'dragover'].forEach(e => {
                this.preventDefaultEvent(e);
            });
        }
    }
</script>

<style>
    @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    body {
        /*font-family: 'Source Sans Pro', sans-serif;*/
        /*font-family: "Arial", "Microsoft YaHei", "黑体", "宋体", sans-serif;*/
        font-family: "Helvetica Neue", Arial, "Hiragino Sans GB", "STHeiti", "Microsoft YaHei", "WenQuanYi Micro Hei", SimSun, Song, sans-serif;
        font-size: 15px;
        line-height: 1.45;
        color: #2c3f51;
    }

    #wrapper {
        /*background: radial-gradient(*/
        /*ellipse at top left,*/
        /*rgba(255, 255, 255, 1) 40%,*/
        /*rgba(229, 229, 229, .9) 100%*/
        /*);*/
        height: 100vh;
        /*padding: 60px 80px;*/
        width: 100vw;
        display: flex;
    }

    .text-area {
        background: #ffffff;
        resize: none;
        border: none;
        outline: none;
        /*font-family: "Arial", "Microsoft YaHei", "黑体", "宋体", sans-serif;*/
        font-family: "Helvetica Neue", Arial, "Hiragino Sans GB", "STHeiti", "Microsoft YaHei", "WenQuanYi Micro Hei", SimSun, Song, sans-serif;
        font-size: 15px;
        line-height: 1.45;
        padding-left: 5px;
        padding-right: 5px;
    }

    .render-area {
        background: #ffffff;
        flex: 1;
        overflow-y: auto;
        word-wrap: break-word;
        min-width: 10px;
        outline: none;
        padding-left: 5px;
        padding-right: 5px;
    }

    .split-bar {
        width: 5px;
        cursor: ew-resize !important;
        display: flex;
        justify-content: center;
    }

    .split-line {
        background: #bfbfbf;
        width: 1px;
    }

    h3 {
        padding-top: 20px;
    }

    p {
        padding-top: 10px;
        padding-bottom: 10px;
    }

    ul {
        margin-left: 30px;
    }

    li ul {
        margin-left: 20px;
    }

    hr {
        margin-top: 10px;
        margin-bottom: 10px;
    }

    blockquote {
        background-color: #e7e7e7;
        padding-left: 20px;
        padding-right: 10px;
        margin-top: 10px;
        margin-bottom: 10px;
    }

    pre {
        margin: 10px;
        border-radius: 3px;
        background-color: #e7e7e7;
        padding: 10px;
    }

    pre code {
        background-color: transparent;
        border-radius: 0;
    }

    code {
        color: #c7254e;
        background-color: #f9f2f4;
        border-radius: 4px;
    }

</style>
