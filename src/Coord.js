export function makeCoord(r, c) {
    return { row: r, col: c};
}
  
export function isEqualCoord(a, b) {
    return (!a && !b) || (a && b && a.row === b.row && a.col === b.col); 
}
  
/**
 * Convert a1 to { row: 1, col: 1 }, a2 to { row: 2, col: 1 }
 * @param {*} t text
 */
export function textToCoord(t) {
    const aVal = "a".charCodeAt(0);
  
    if (!t || t.length != 2) return;
    let c = t.charCodeAt(0) - aVal + 1;
    if (c < 1 || c > 8) return;
    let r = parseInt(t.charAt(1));
    if (r < 1 || r > 8) return;
    return { row: r, col: c};
}
  
/** if r=2, c=4, returns d2 (c=4=>d, r=2=>2 1 based)
 * row: integer, 1-8
 * col: integer, 1-8
 */
export function coordToText(coord) {
    const aVal = "a".charCodeAt(0);
    return String.fromCharCode(aVal + coord.col - 1) + (coord.row).toString();
  
}  