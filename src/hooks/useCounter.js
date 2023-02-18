import { useState } from "react";


export default function useCounter(defaultCount = 1, maxValue, minValue) {
    const [count, setCount] = useState(defaultCount);

    const changeCount = (number) => setCount((state) => minValue <= +number && +number <= maxValue ? number : state);
    const increase = () => setCount((state) => +state+1 <= maxValue ? +state+1 : state);
    const decrease = () => setCount((state) => +state-1 >= minValue ? +state-1 : state);

    return { count, changeCount, increase, decrease };
}