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

// CMD/CTRL + / to ficus on search input
function KeyPress(e) {
    const evtobj = e
    if (evtobj.keyCode == 75 && evtobj.metaKey) searchInput.focus();
    else if (evtobj.keyCode == 75 && evtobj.ctrlKey) searchInput.focus();
}

document.onkeyup = KeyPress;

function navClick() {
    const nav = document.getElementById('nav')
    const navDrop = document.getElementById('navDrop')

    nav.classList.add('bg-gradient-to-r')
    nav.classList.add('from-red-500')
    nav.classList.add('to-purple-500')
    nav.classList.add('text-white')
    nav.classList.remove('bg-gray-100')
    nav.classList.remove('text-gray-700')

    navDrop.classList.remove('bg-white')
    navDrop.classList.add('bg-gradient-to-r')
    navDrop.classList.add('from-red-500')
    navDrop.classList.add('to-purple-500')
    navDrop.classList.add('text-white')
}