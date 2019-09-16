



export interface Point {
    readonly x: number;
    readonly y: number;
}

export interface Piece {
    hasMoved: boolean
    side: "black" | "white";
    alive: boolean,
    type: "pawn" | "rook" | "knight" | "bishop" | "queen" | "king",
}

export interface SelectedPiece {
    piece: Piece,
    point: Point
}
