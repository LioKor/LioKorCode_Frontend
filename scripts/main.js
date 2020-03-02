'use strict';

// todo: add throw check to test
// todo: save on task switch, file open and file save

const VERSION = '0.2.0';
const RELEASE_DATE = '02.03.2020';
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
        tests: null,

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

                blocksArr = createTestsInfo('testsInfo', 'examplesTable', self.tests);
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

                if (code === null) {
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
    // todo: rewrite with vue, innerHTML to DOM
    // returns html elements that represent test blocks (green and red)
    let testsInfo = document.getElementById('testsInfo');
    let infoBlock = document.getElementById(infoBlockId);
    let examplesTable = document.getElementById(examplesTableId);

    testsInfo.innerHTML = '';

    let tableInner = examplesTable.innerHTML;
    tableInner = tableInner.slice(0, tableInner.search('</thead>') + 8);
    examplesTable.innerHTML = tableInner;
    
    let block;
    let blocksArr = [];
    for (let i = 0; i < tests.length; i++) {
        let test = tests[i];
        block = createTestInfoBlock(i + 1);
        testsInfo.appendChild(block);
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

function selectAndOpenFile() {
   let fInput = document.createElement('input');
   fInput.type = 'file';
   fInput.click();

   fInput.addEventListener('change', function (e) {
       // todo: refactor with drag and drop
       if (e.target.files) {
           e.target.files[0].text().then(function (s) {
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
