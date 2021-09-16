import { useState, useEffect, useMemo } from './MyReact'

export default function Component({propCount, buttonElem }) {
    // const count = 0

    // can be a plain value or a function
    const [count, setCount]= useState(0)
    // const [count, setCount]= useState(() => 10)

    // const propCountDoubled = 0
    const propCountDoubled = useMemo(() => {
        // should only be called when propCount change
        console.log('In memo')
        return propCount * 2
    }, [propCount])

    useEffect(() => {
        const handler = () => setCount(currentCount => currentCount + 1)
        buttonElem.addEventListener('click', handler)

        // cleanup
        return () => buttonElem.removeEventListener('click', handler)
    }, [buttonElem])

    // HACK: we don't have useEffect yet that updates state
    // update state after 2 seconds
    // setTimeout (() => {
    //     // can be plain value or function
    //     // setCount(20)
    //     setCount(prev => prev + 1)
    // }, 2000)

    return `
        State: ${count}
        Prop: ${propCount}
        Prop Doubled: ${propCountDoubled}
    `
}
