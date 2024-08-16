document.addEventListener('DOMContentLoaded', () =>{
    fetch("index.html")
    .then(response => response.text())
    .then(data => {
        document.body.insertAdjacentHTML('afterbegin', data)
    })
});