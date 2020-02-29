function request(method, url, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.addEventListener('load', function () {
        callback(xhr.status, xhr.response);
    });
    xhr.send();
}

function downloadURI(uri, filename='script.js') {
    let link = document.createElement('a');
    link.download = filename;
    link.href = uri;
    link.click();
    link.remove();
}