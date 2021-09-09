import { render } from './MyReact'

import Component from './Component'

function renderComponent() {
    render(Component, {
        propCount: 1
    }, document.querySelector('#root'))
}

renderComponent()

