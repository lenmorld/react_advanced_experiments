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
    }, document.querySelector('#root'))
}

renderComponent()

