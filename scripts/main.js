'use strict';

// todo: drag and drop to "upload"
// todo: add throw check to test
// todo: name or id of task on download

const VERSION = '0.1.0';
const RELEASE_DATE = '28.02.2020';
versionInfo.innerHTML = 'v. ' + VERSION;

const EXECUTOR_SCRIPT_PATH = 'scripts/executor.js';
const EventBus = new Vue();
let blocksArr;

let timeApp = new Vue({
    el: '#liokorEdu',
    delimiters: ['${', '}'],
    data: {
        amount: 0,
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
        },
        updateSeconds: function () {
            this.s.total = (this.ms.total / 1000).toFixed(3);
            this.s.max = (this.ms.max / 1000).toFixed(3);
            this.s.average = (this.ms.average / 1000).toFixed(3);
            this.s.min = (this.ms.min / 1000).toFixed(3);
        },
        add: function (time) {
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
        }
    }
});

let taskApp = new Vue({
    el: '#task',
    data: {
        name: null,
        description: null,
        tests: null
    },
    methods: {
        load: function (name) {
            let self = this;
            request('GET', window.location.href.split('?')[0] + '/tasks/' + name, function (status, response) {
                let task = JSON.parse(response);
                self.name = task.name;
                self.description = task.description;
                self.tests = task.tests;

                EventBus.$emit('commentFunction', self.tests[0][0], self.tests[0][1]);

                blocksArr = createTestsInfo('testsInfo', 'examplesTable', self.tests);
            });
        }
    },
    mounted: function () {
        this.load('task_arr_sum.json');
    }
});

let editorApp = new Vue({
    el: '#editorBlock',
    data: {
        aceEditor: null,

        LOCAL_STORAGE_NAME: 'codeDraft'
    },
    methods: {
        saveToLocalStorage: function () {
            localStorage.setItem(this.LOCAL_STORAGE_NAME, this.aceEditor.getValue());
        },
        downloadCode: function (save = true) {
            if (save) {
                this.saveToLocalStorage();
            }
            let editorCode = this.aceEditor.getValue();
            let encodedCode = encodeURIComponent(editorCode);
            downloadURI(`data:application/javascript,${encodedCode}`, 'task.js');
        }
    },
    mounted: function () {
        this.aceEditor = ace.edit('editorBlock');
        this.aceEditor.setOptions({
            fontSize: '12pt',
        });

        //editor.setTheme('ace/theme/dawn');
        this.aceEditor.session.setMode('ace/mode/javascript');

        EventBus.$on('commentFunction', (args, ret) => {
            let comment = '';
            let editorCode = localStorage.getItem(this.LOCAL_STORAGE_NAME);

            if (editorCode === null) {
                editorCode = '';
                comment += '/**\n';
                for (let arg of args) {
                    comment += ` * @param {${typeof (arg)}}\n`;
                }
                if (ret !== null) {
                    comment += ` * @returns {${typeof (ret)}}\n`;
                }
                comment += ' */\n';
            }

            this.aceEditor.setValue(comment + editorCode);
            this.aceEditor.execCommand("gotolineend");
            this.aceEditor.focus();
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

function createTestInfoBlock(number) {
    let mainBlock = document.createElement('div');
    let numberLabel = document.createElement('label');
    numberLabel.innerHTML = number;
    let errorBlock = document.createElement('div');
    errorBlock.classList.add('errorMessage');
    
    mainBlock.appendChild(numberLabel);
    mainBlock.appendChild(errorBlock);
    
    return mainBlock;
}

function createTestsInfo(infoBlockId, examplesTableId, tests, examplesAmount = 2) {
    // returns html elements that repesent test blocks (green and red)
    let infoBlock = document.getElementById(infoBlockId);
    let examplesTable = document.getElementById(examplesTableId);
    
    let block;
    let blocksArr = [];
    for (let i = 0; i < tests.length; i++) {
        let test = tests[i];
        block = createTestInfoBlock(i + 1);
        document.getElementById('testsInfo').appendChild(block);
        blocksArr.push(block);
        if (i < examplesAmount) {
            let args = '';
            let testArgs = test[0];
            for (let j = 0; j < testArgs.length; j++) {
                args += JSON.stringify(testArgs[j]);
                if (j < testArgs.length - 1) {
                    args += ', ';
                }
            }
            let result = JSON.stringify(test[1]);
            examplesTable.innerHTML += '<tr><td>' + args + '</td><td>' + result + '</td></tr>';
        }
    }
    
    return blocksArr;
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
        
        for (let i = 0; i < blocksArr.length; i++) {
            blocksArr[i].classList.remove('success', 'error');
        }
        timeApp.resetAll();

        // todo: duplicate code below
        executorWorker.postMessage([0, userCode, taskApp.tests[0]]);

        sourceCode.innerHTML = userCode;
        hljs.highlightBlock(sourceCode);
        hljs.lineNumbersBlock(sourceCode);
    } else {
        alert('Код не изменился с последней проверки!');
    }
}
function executorMessage(e) {
    let block = blocksArr[e.data[0]];
    timeApp.add(e.data[2]);
    
    if (e.data[1]) {
        block.classList.add('success');
        block.classList.remove('error');
        
        let i = e.data[0] + 1;
        if (i < taskApp.tests.length) {
            // todo: send all tests at once? or parallel better?
            executorWorker.postMessage([i, userCode, taskApp.tests[i]]);
        } else {
            // todo: code dublication
            checkingInProgress = false;
            terminateButton.style.display = 'none';
            checkButton.style.display = 'inline-block';
        }
    } else {
        block.classList.remove('success');
        block.classList.add('error');
        block.children[1].innerHTML = e.data[3];
        
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
