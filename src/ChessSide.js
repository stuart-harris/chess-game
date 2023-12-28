export class ChessSide {
    static BLACK_SIDE = "Black";
    static WHITE_SIDE = "White";
    static getOtherSide(side) {
        if (!side || (side !== this.BLACK_SIDE && side !== this.WHITE_SIDE)) return "";

        return side === this.BLACK_SIDE ? this.WHITE_SIDE : this.BLACK_SIDE;
    }
}