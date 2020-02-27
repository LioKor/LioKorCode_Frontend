'use strict';

const EXECUTOR_SCRIPT_PATH = 'scripts/executor.js';

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

function requestTests() {
    /*return '[\
        [[1, 2], 3],\
        [[-5, 6], 1],\
        [[-1, 2], 1],\
        [[100000, 1], 100001],\
        [[999999, 1], 1000000],\
        [[55, 0], 55]\
    ]';*/
    return '[\
        [[[1, 2, 3], [3, 4, 5]], [4, 6, 8]],\
        [[[-5, -6, -20, 0, 15], [1, 2, 3]], [-4, -4, -17, 0, 15]],\
        [[[], []], []],\
        [[[1, 2], [1]], [2, 2]],\
        [[[], [1, 2]], [1, 2]]\
    ]';
}

let tests_json = requestTests();
let tests;
try {
    tests = JSON.parse(tests_json);
} catch (e) {
    alert('Incorrect tests were received!');
}
let blocksArr = createTestsInfo('testsInfo', 'examplesTable', tests);

let userCode;
let checkingInProgress = false;
function checkDecision() {
    if (userCode !== editor.getValue()) {
        // todo: code dublication
        checkingInProgress = true;
        terminateButton.style.display = 'inline-block';
        checkButton.style.display = 'none';
    
        userCode = editor.getValue();
        
        for (let i = 0; i < blocksArr.length; i++) {
            blocksArr[i].classList.remove('success', 'error');
        }
        timeApp.resetAll();
        
        executorWorker.postMessage([0, userCode, tests[0]]);

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
        if (i < tests.length) {
            executorWorker.postMessage([i, userCode, tests[i]]);
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
    // todo: code dublication
    executorWorker.terminate();
    executorWorker = new Worker(EXECUTOR_SCRIPT_PATH);
    executorWorker.addEventListener('message', executorMessage);
    
    userCode = null;
    
    // todo: code dublication
    checkingInProgress = false;
    terminateButton.style.display = 'none';
    checkButton.style.display = 'inline-block';
    
    alert('Проверка остановлена!');
}

function saveDecision() {
    alert('Сохранение временно недоступно!');
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

checkButton.addEventListener('click', checkDecision);
terminateButton.addEventListener('click', terminateExecutor);
saveButton.addEventListener('click', saveDecision);
closeButton.addEventListener('click', closeSolver);
window.addEventListener('keydown', function (e) {
    if (e.keyCode === 120) {
        if (e.ctrlKey) {
            if (checkingInProgress) {
                terminateExecutor();
            }
        } else {
            if (!checkingInProgress) {
                checkDecision();
            }
        }
    } else if (e.keyCode === 83 && e.ctrlKey) {
        e.preventDefault();
        saveDecision();
        return false;
    } else if (e.keyCode === 27) {
        closeSolver();
    }
});
checkDecision();