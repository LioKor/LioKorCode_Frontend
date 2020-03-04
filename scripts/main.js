'use strict';

// todo: add throw check to test
// todo: console.log to html (stdout block in html)
// todo: large tests to default tasks (to better decision performance check)
// todo: simple eval execution (to learn and debug) with console.log to html (code.replace('console.log', 'htmlLog'));
// todo: time of each test?

// todo: drag&drop decoration
// todo: adaptive design

const VERSION = '0.2.1';
const RELEASE_DATE = '04.03.2020';
versionInfo.innerHTML = 'v. ' + VERSION;

const EXECUTOR_SCRIPT_PATH = 'scripts/executor.js';
const EventBus = new Vue();

let checkApp = new Vue({
    el: '#checkArea',
    delimiters: ['{{', '}}'],
    data: {
        amount: 0,

        // describes if test passed or not, and if not - specifies and error
        // format: {passed: null|true|false, errorText: ''}
        testsInfo: [
        ],

        // string that stores the code which was tested (result is this.testsInfo)
        checkedCode: 'wolf',

        ms: {
            total: 0,
            max: null,
            average: 0,
            min: null
        },
        s: {
            total: '-',
            max: '-',
            average: '-',
            min: '-'
        }
    },
    methods: {
        resetTestsInfo(len = 0) {
            this.testsInfo = [];
            for (let i = 0; i < len; i++) {
                this.testsInfo.push({passed: null, errorText: null})
            }
        },
        resetAll: function () {
            this.amount = 0;
            
            this.ms.total = 0;
            this.ms.max = null;
            this.ms.average = 0;
            this.ms.min = null;
            
            this.s.total = '-';
            this.s.max = '-';
            this.s.average = '-';
            this.s.min = '-';

            this.resetTestsInfo(this.testsInfo.length);
        },
        updateSeconds: function () {
            this.s.total = (this.ms.total / 1000).toFixed(3);
            this.s.max = (this.ms.max / 1000).toFixed(3);
            this.s.average = (this.ms.average / 1000).toFixed(3);
            this.s.min = (this.ms.min / 1000).toFixed(3);
        },
        addTime: function (time) {
            this.amount += 1;

            this.ms.total += time;
            this.ms.average = this.ms.total / this.amount;
            if (time > this.ms.max || this.ms.max === null) {
                this.ms.max = time;
            }
            if (time < this.ms.min || this.ms.min === null) {
                this.ms.min = time;
            }

            this.updateSeconds();

            return (time / 1000).toFixed(3);
        },

        getTestInfoClass: function (test) {
            return (test.passed !== null)? ((test.passed)? 'success': 'error'): '';
        }
    },
    watch: {
        checkedCode: function(newCode) {
            this.$refs.sourceCode.innerHTML = newCode;
            hljs.highlightBlock(this.$refs.sourceCode);
            hljs.lineNumbersBlock(this.$refs.sourceCode);
        }
    },
    mounted: function () {
        let self = this;
        EventBus.$on('testsAmount', function (amount) {
            self.resetTestsInfo(amount);
        });
    }
});

let taskApp = new Vue({
    el: '#task',
    data: {
        name: null,
        description: null,
        tests: [],

        tasksList: null,
        selectedTaskName: null
    },
    methods: {
        load: function (name) {
            let self = this;
            let taskUrl = getCurrentUrl() + '/tasks/' + name;
            request('GET', taskUrl, function (status, data) {
                let task = JSON.parse(data);
                self.name = task.name;
                self.description = task.description;
                self.tests = task.tests;

                EventBus.$emit('taskChanged', self.selectedTaskName, self.tests[0][0], self.tests[0][1]);
                EventBus.$emit('testsAmount', self.tests.length);
            });
        },
        taskSelected: function () {
            this.load(this.selectedTaskName);
        }
    },
    mounted: function () {
        let taskListUrl = getCurrentUrl() + '/tasks/list.json';
        let self = this;
        request('GET', taskListUrl, function (status, data) {
            self.tasksList = JSON.parse(data);
            self.selectedTaskName = self.tasksList[0];
            self.taskSelected();
        });
    }
});

let editorApp = new Vue({
    el: '#editorBlock',
    data: {
        aceEditor: null,

        currentTaskName: null
    },
    methods: {
        saveToLocalStorage: function () {
            if (this.currentTaskName) {
                localStorage.setItem(this.currentTaskName, this.aceEditor.getValue());
                return true;
            } else {
                return false;
            }
        },
        loadFromLocalStorage: function (args, ret) {
            if (this.currentTaskName) {
                let code = localStorage.getItem(this.currentTaskName);

                if (code === null || code === '') {
                    code = '';

                    code += '/**\n';
                    for (let arg of args) {
                        code += ` * @param {${typeof (arg)}}\n`;
                    }
                    if (ret !== null) {
                        code += ` * @returns {${typeof (ret)}}\n`;
                    }
                    code += ' */\n';
                }

                this.aceEditor.setValue(code);
                this.aceEditor.execCommand("gotolineend");
                this.aceEditor.focus();
            }
        },
        downloadCode: function (save = true) {
            if (save) {
                this.saveToLocalStorage();
            }
            let editorCode = this.aceEditor.getValue();
            let encodedCode = encodeURIComponent(editorCode);
            let downloadName = this.currentTaskName.split('.')[0];
            downloadURI(`data:application/javascript,${encodedCode}`, downloadName + '.js');
        },
        setText: function (s) {
            this.aceEditor.setValue(s);
            this.aceEditor.execCommand("gotolineend");
        }
    },
    mounted: function () {
        this.aceEditor = ace.edit('editorBlock');
        this.aceEditor.setOptions({
            fontSize: '12pt',
        });

        //editor.setTheme('ace/theme/dawn');
        this.aceEditor.session.setMode('ace/mode/javascript');

        EventBus.$on('taskChanged', (name, args, ret) => {
            if (this.currentTaskName) {
                // saving only if there's a task opened, otherwise at first load will save empty
                this.saveToLocalStorage();
            }
            this.currentTaskName = name;
            this.loadFromLocalStorage(args, ret);
        });
    }
});

let taskHidden = false;

let executorWorker;
if (window.Worker) {
    executorWorker = new Worker(EXECUTOR_SCRIPT_PATH);
} else {
    alert('К сожалению, ваш браузер не поддерживается!');
}

let userCode;
let checkingInProgress = false;
function checkDecision(editor) {
    let editorValue = editor.getValue();
    if (userCode !== editorValue) {
        checkingInProgress = true;
        terminateButton.style.display = 'inline-block';
        checkButton.style.display = 'none';
    
        userCode = editorValue;
        editorApp.saveToLocalStorage();

        checkApp.resetAll();

        // todo: duplicate code below
        executorWorker.postMessage({
            testIndex: 0,
            test: taskApp.tests[0],
            code: userCode
        });

        checkApp.checkedCode = userCode;
    } else {
        alert('Код не изменился с последней проверки!');
    }
}
function executorMessage(e) {
    let testInfo = checkApp.testsInfo[e.data.testIndex];
    checkApp.addTime(e.data.time);
    
    if (e.data.passed) {
        testInfo.passed = true;
        
        let i = e.data.testIndex + 1;
        if (i < taskApp.tests.length) {
            // todo: send all tests at once? or parallel better?
            executorWorker.postMessage({
                testIndex: i,
                test: taskApp.tests[i],
                code: userCode
            });
        } else {
            // todo: code dublication
            checkingInProgress = false;
            terminateButton.style.display = 'none';
            checkButton.style.display = 'inline-block';
        }
    } else {
        testInfo.passed = false;
        testInfo.errorText = e.data.errorText;
        
        // todo: code dublication
        checkingInProgress = false;
        terminateButton.style.display = 'none';
        checkButton.style.display = 'inline-block';
    }
}
// todo: code dublication
executorWorker.addEventListener('message', executorMessage);

function terminateExecutor() {
    // todo: remove duplicated code (need function to create worker)
    executorWorker.terminate();
    executorWorker = new Worker(EXECUTOR_SCRIPT_PATH);
    executorWorker.addEventListener('message', executorMessage);
    
    userCode = null;

    checkingInProgress = false;
    terminateButton.style.display = 'none';
    checkButton.style.display = 'inline-block';
}

function selectAndOpenFile() {
   let fInput = document.createElement('input');
   fInput.type = 'file';
   fInput.click();

   fInput.addEventListener('change', function (e) {
       if (e.target.files) {
           e.target.files[0].text().then(function (s) {
               editorApp.saveToLocalStorage();
               editorApp.setText(s);
           })
       }
   });
}

function closeSolver() {
    alert('Функционал в процессе реализации!');
}

hideTask.addEventListener('click', function () {
    taskHidden = !taskHidden;
    task.classList.toggle('hidden');
    
    if (taskHidden)
        hideTask.innerHTML = '->';
    else
        hideTask.innerHTML = '<-';
});

checkButton.addEventListener('click', function () {
    checkDecision(editorApp.aceEditor);
});
terminateButton.addEventListener('click', terminateExecutor);
saveButton.addEventListener('click', editorApp.downloadCode);
closeButton.addEventListener('click', closeSolver);
openButton.addEventListener('click', selectAndOpenFile);
window.addEventListener('keydown', function (e) {
    if (e.code === 'F9') {
        if (e.ctrlKey) {
            if (checkingInProgress) {
                terminateExecutor();
            }
        } else {
            if (!checkingInProgress) {
                checkDecision(editorApp.aceEditor);
            }
        }
    } else if (e.code === 'KeyS' && e.ctrlKey) {
        e.preventDefault();
        editorApp.downloadCode();
        return false;
    } else if (e.code === 'Escape') {
        closeSolver();
    }
});

mainBlock.addEventListener('drop', function (e) {
    e.preventDefault();

    if (e.dataTransfer.items) {
        let file = e.dataTransfer.items[0].getAsFile();
        file.text().then(function (s) {
            editorApp.setText(s);
        });
    }
});

// prevent default browser drag&drop behavior
mainBlock.addEventListener('dragover', function (e) {
   e.preventDefault();
});
