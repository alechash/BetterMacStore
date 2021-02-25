/**
 * Copyright 2021 to present, The Better Mac Store
 * 
 * Other use is not permitted.
 */

/** 
 * service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(function (registration) {
        console.log('Registration succeeded.');

        registration.update();
    }).catch(function (error) {
        console.log('Registration failed with ' + error);
    });
}
*/

const searchInput = document.getElementById('searchInput')
const search = document.getElementById('search')

searchInput.addEventListener("keypress", function (event) {
    if (event.key == 'Enter') {
        if (searchInput.value == '' || searchInput.value == undefined) {
            search.classList.add('border-red-400')
            search.classList.add('border-2')
        } else {
            window.location = `/search${"?"}q=${searchInput.value}`
        }
    }
});

window.onkeyup = function (event) {
    if (event.keyCode == 191) {
        searchInput.focus()
    }
};