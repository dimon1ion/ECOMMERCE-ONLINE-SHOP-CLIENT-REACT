import { useState } from "react";


export default function useToggle(defaultIsOpen = false) {
    const [isOpen, setIsOpen] = useState(defaultIsOpen || false);

    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    const toggle = () => setIsOpen(state => !state);

    return { isOpen, toggle, open, close };
}