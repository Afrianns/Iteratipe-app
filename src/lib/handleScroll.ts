export const handleScroll = (el: HTMLDivElement): boolean[] => {
    const isAtEnd = Math.ceil(el.scrollLeft + el.clientWidth) < el.scrollWidth;
    return [Math.ceil(el.scrollLeft) > 0, isAtEnd]
}