
import {

    IconDefinition
} from "@fortawesome/free-solid-svg-icons";


export interface Point {
    readonly x: number;
    readonly y: number;
}

export interface Piece {
    hasMoved: boolean
    side: "black" | "white";
    alive: boolean,
    type:  "pawn" | "rook" | "knight" | "bishop" | "queen" | "king",
    icon:IconDefinition
}

export interface SelectedPiece {
    piece: Piece,
    point: Point
}
