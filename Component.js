import { useState } from './MyReact'

export default function Component({propCount}) {
    // const count = 0

    // can be a primitive value or a function
    const [count, setCount]= useState(10)
    // const [count, setCount]= useState(() => 10)

    const propCountDoubled = 0

    setTimeout (() => {
        // can be plain value or function
        // setCount(20)
        setCount(prev => prev + 1)
    }, 2000)

    return `
        State: ${count}
        Prop: ${propCount}
        Prop Doubled: ${propCountDoubled}
    `
}
