import { useState, useEffect, useRef } from 'react';

// 1. Define what your helper layout calculator expects and returns
type ScrollCheckFn = (el: HTMLDivElement) => boolean[];

export function useGradientScrollEdge(handleScrollFn: ScrollCheckFn) {
    const elementRef = useRef<HTMLDivElement>(null);
    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(true);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        // One single function that calculates the specific element's boundaries
        const updateGradients = () => {
            const [left, right] = handleScrollFn(element);
            setShowLeft(left);
            setShowRight(right);
        };

        // Run once immediately on page load
        updateGradients();

        // Attach listener
        element.addEventListener('scroll', updateGradients);

        // Clean up natively
        return () => {
            element.removeEventListener('scroll', updateGradients);
        };
    }, [handleScrollFn]); // Safe abstraction

    // Return the ref and the live states so your components can use them
    return [elementRef, showLeft, showRight] as const;
}
