let globalId = 0
let globalParent

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
    // need access to parent
    // console.log(componentState.get(globalParent))

    const id = globalId
    // scoped inside useState
    const parent = globalParent
    globalId++

    // closure allows us to keep value of parent inside
    // even when globalParent is changed, parent inside keeps its value
    return (() => {
        const { cache } = componentState.get(parent)

        // set initial value of cache for "state"
        // if function e.g. useState(() => func())
        // else plain value e.g. useState(0)
        if (cache[id] == null) {
            cache[id] = {
                value: typeof initialState === 'function' ?
                        initialState() :
                        initialState
            }
        }
    
        // setState updates cache
        // if function e.g setState((prev) => prev + 1)
        // else plain value e.g. setState(0)
        const setState = state => {
            // make sure to get updated
            const { props, component } = componentState.get(parent)

            if (typeof state === 'function') {
                // state updater function
                cache[id].value = state(cache[id].value)
            } else {
                // regular setState
                cache[id].value = state
            }
    
            // re-render 🤯
            render(component, props, parent)
        }
    
        // return [initialState, () => {}]
        return [cache[id].value, setState]
    })()
}

export function useEffect(callback, dependencies) {
    const id = globalId
    const parent = globalParent
    globalId++

    (() => {
        const { cache } = componentState.get(parent)

        // store an array of deps
        if (cache[id] == null) {
            cache[id] = {
                // 1st time, cache empty
                dependencies: undefined
            }
        }
    
        // if deps null -> run every time
        const dependenciesChanged = 
            dependencies == null ||
            dependencies.some((dep, i) => {
                return (
                    // no deps yet -> first render
                    cache[id].dependencies == null ||
                    // check if changed
                    cache[id].dependencies[i] !== dep
                )
            })

        if (dependenciesChanged) {
            // if cleanup provided, call
            if (cache[id].cleanup != null) cache[id].cleanup()

            // assign whatever callback returned, that's the cleanup function
            cache[id].cleanup = callback()

            cache[id].dependencies = dependencies
        }
    })()
}

export function useMemo(callback, dependencies) {
    const id = globalId
    const parent = globalParent
    globalId++

    (() => {
        const { cache } = componentState.get(parent)

        // store an array of deps
        if (cache[id] == null) {
            cache[id] = {
                // 1st time, cache empty
                dependencies: undefined
            }
        }
    
        // if deps null -> run every time
        const dependenciesChanged = 
            dependencies == null ||
            dependencies.some((dep, i) => {
                return (
                    // no deps yet -> first render
                    cache[id].dependencies == null ||
                    // check if changed
                    cache[id].dependencies[i] !== dep
                )
            })

        // no cleanup for memo
        // instead of returning a cleanup, return a value
        if (dependenciesChanged) {
            cache[id].value = callback()
            cache[id].dependencies = dependencies
        }

        return cache[id].value
    })()
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

     // update globalParent
     globalParent = parent

    const output = component(props)

    // reset 
    globalId = 0;

    parent.innerHTML = output
}
