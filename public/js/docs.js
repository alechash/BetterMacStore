const dev_expand = document.getElementById('dev_expand')
const toggle_indicator_closed = document.getElementById('toggle_indicator_closed')
const toggle_indicator_open = document.getElementById('toggle_indicator_open')
const toc_content = document.getElementById('toc_content')

dev_expand.addEventListener('click', function () {
    toc_content.classList.toggle('hidden')
    toggle_indicator_closed.classList.toggle('hidden')
    toggle_indicator_open.classList.toggle('hidden')
})