function downloadURI(uri, filename='script.js') {
    let link = document.createElement('a');
    link.download = filename;
    link.href = uri;
    link.click();
    link.remove();
}