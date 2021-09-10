import { render } from './MyReact'

import Component from './Component'

let propCount = 0

document.getElementById('btn-prop').addEventListener('click', () => {
    propCount++
    renderComponent()
})

function renderComponent() {
    render(Component, {
        propCount,
        buttonElem: document.querySelector('#btn-count')
    }, document.querySelector('#root'))

    render(Component, {
        propCount,
        buttonElem: document.querySelector('#btn-count-2')
    }, document.querySelector('#root-2'))
}

renderComponent()

