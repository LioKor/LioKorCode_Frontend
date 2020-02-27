'use strict';

self.importScripts('../extensions/chai.js');
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
    return [testPassed, time, failText];
}

this.addEventListener('message', function(e) {
    let f = new Function("'use strict'; return " + e.data[1])(); 
    let testRes = runTest(f, e.data[2]);
    this.postMessage([e.data[0], testRes[0], testRes[1], testRes[2]]);
});