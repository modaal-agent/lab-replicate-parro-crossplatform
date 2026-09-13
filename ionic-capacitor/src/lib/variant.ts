/**
 * True in the `matched` build, `vite build --mode matched` (spec 001 §13.4 option A, D13). TSX that differs by
 * styling variant tests this; styles differ through the `@style` alias instead.
 */
export const isMatched = import.meta.env.MODE === 'matched';
