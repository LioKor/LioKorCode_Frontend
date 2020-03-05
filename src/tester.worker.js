'use strict';

import chai from 'chai/lib/chai';
//self.importScripts('./extensions/chai.js');
let expect = chai.expect;
let AssertionError = chai.AssertionError;

function getErrorLineNumberString(e) {
    // works only in Firefox!
    /*  -2 because return of new Function.. is:

        function anonymous(
        ) {
            'use strict'; return function sum(a, b) {    <----
    ...*/

    return (!isNaN(e.lineNumber))? ((e.lineNumber - 2) + ': '): '';
}

function runTest(f, test) {
    let testPassed = true;
    let failText = '';

    let testSaved = JSON.parse(JSON.stringify(test[0])); // deep copy of an object

    let timeStart = performance.now();
    try {
        expect(f.apply(this, test[0])).to.eql(test[1]);
    } catch (e) {
        testPassed = false;
        failText = getErrorLineNumberString(e) + e.toString();
    }
    let time = performance.now() - timeStart;

    try {
        expect(test[0]).to.eql(testSaved);
    } catch (e) {
        testPassed = false;
        failText = 'Arguments have changed after test execution!'
    }

    return {
        isPassed: testPassed,
        failText: failText,
        time: time
    }
}

self.addEventListener('message', function(e) {
    let code = e.data.code;

    let result = {
        testIndex: e.data.testIndex,
        passed: false,
        time: 0,
        errorText: null
    };

    let funcPos = code.search('function');
    if (funcPos === -1) {
        result.errorText = 'Function was not found!';
    } else {
        let functionCode = code.slice(funcPos);
        let f = new Function("'use strict'; return " + functionCode)();
        let testRes = runTest(f, e.data.test);

        result.passed = testRes.isPassed;
        result.time = testRes.time;
        result.errorText = testRes.failText;
    }

    this.postMessage(result);
});