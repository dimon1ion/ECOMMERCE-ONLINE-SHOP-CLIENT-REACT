import { useState } from "react";


export default function usePagination(defaultPage = 1, defaultOffset = 10) {
    const [currentPage, setCurrentPage] = useState(defaultPage);
    const [offset, setOffset] = useState(defaultOffset);
    const [totalPages, setTotalPages] = useState(0);

    const increment = () => setCurrentPage(state => +state + 1);
    const decrement = () => setCurrentPage(state => +state - 1);

    return { currentPage, offset, totalPages, setTotalPages, increment, decrement, setCurrentPage };
}