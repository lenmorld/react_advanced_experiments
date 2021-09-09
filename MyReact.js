let globalId = 0

/* 
 Map can have anything as keys
 and remembers the original insertion order
 use parent as key, since a parent can only
 have one child (innerHTML)
 parent key will always be unique
*/
const componentState = new Map()

/*
    calling function must save some "global" state
    where is it called? order of call?
    hooks rules: 
        - called in order, top to bottom
        - called every render

    store info on each hook call
*/
export function useState(initialState) {
    console.log(componentState)
    return [initialState, () => {}]
}

export function render(component, props, parent) {
    /*
        default to cache array
        store info about indiv. hook
        {
            cache: [1st call:, 2nd call, ...],
            component,
            props,
        }
    */
    const state = componentState.get(parent) || { 
        cache: []
     }

     componentState.set(parent, {
         ...state, // cache stays the same for every render
         component, // ...but update component and props
         props
     })

    const output = component(props)

    // reset 
    globalId = 0;

    parent.innerHTML = output
}
