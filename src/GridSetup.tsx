import React, {useEffect, useState} from 'react';
import {Board} from "./Board";
import {Piece} from "./global.interfaces";


export function GridSetup() {


    let [grid, setGrid] = useState<Array<Array<Piece | any>>>([]);


    function setGridAtIndex(x: number, y: number, item: Piece) {
        let clone = [...grid];
        // console.log(clone)
        clone[x][y] = item;
        // console.log(clone)
        setGrid([...clone])
    }

    useEffect(() => {
        setGrid(new Array(8));
        for (let i = 0; i < 8; i++) {
            setGrid(grid[i] = new Array(8))
        }
        setGridAtIndex(0, 1, {hasMoved: false, side: 'white', type: 'pawn', alive: true});
        setGridAtIndex(1, 1, {hasMoved: false, side: 'white', type: 'pawn', alive: true});
        setGridAtIndex(2, 1, {hasMoved: false, side: 'white', type: 'pawn', alive: true});
        setGridAtIndex(3, 1, {hasMoved: false, side: 'white', type: 'pawn', alive: true});
        setGridAtIndex(4, 1, {hasMoved: false, side: 'white', type: 'pawn', alive: true});
        setGridAtIndex(5, 1, {hasMoved: false, side: 'white', type: 'pawn', alive: true});
        setGridAtIndex(6, 1, {hasMoved: false, side: 'white', type: 'pawn', alive: true});
        setGridAtIndex(7, 1, {hasMoved: false, side: 'white', type: 'pawn', alive: true});

        setGridAtIndex(0, 0, {hasMoved: false, side: 'white', type: 'rook', alive: true});
        setGridAtIndex(1, 0, {hasMoved: false, side: 'white', type: 'knight', alive: true});
        setGridAtIndex(2, 0, {hasMoved: false, side: 'white', type: 'bishop', alive: true});
        setGridAtIndex(3, 0, {hasMoved: false, side: 'white', type: 'queen', alive: true});
        setGridAtIndex(4, 0, {hasMoved: false, side: 'white', type: 'king', alive: true});
        setGridAtIndex(5, 0, {hasMoved: false, side: 'white', type: 'bishop', alive: true});
        setGridAtIndex(6, 0, {hasMoved: false, side: 'white', type: 'knight', alive: true});
        setGridAtIndex(7, 0, {hasMoved: false, side: 'white', type: 'rook', alive: true});

        setGridAtIndex(0, 6, {hasMoved: false, side: 'black', type: 'pawn', alive: true});
        setGridAtIndex(1, 6, {hasMoved: false, side: 'black', type: 'pawn', alive: true});
        setGridAtIndex(2, 6, {hasMoved: false, side: 'black', type: 'pawn', alive: true});
        setGridAtIndex(3, 6, {hasMoved: false, side: 'black', type: 'pawn', alive: true});
        setGridAtIndex(4, 6, {hasMoved: false, side: 'black', type: 'pawn', alive: true});
        setGridAtIndex(5, 6, {hasMoved: false, side: 'black', type: 'pawn', alive: true});
        setGridAtIndex(6, 6, {hasMoved: false, side: 'black', type: 'pawn', alive: true});
        setGridAtIndex(7, 6, {hasMoved: false, side: 'black', type: 'pawn', alive: true});

        setGridAtIndex(0, 7, {hasMoved: false, side: 'black', type: 'rook', alive: true});
        setGridAtIndex(1, 7, {hasMoved: false, side: 'black', type: 'knight', alive: true});
        setGridAtIndex(2, 7, {hasMoved: false, side: 'black', type: 'bishop', alive: true});
        setGridAtIndex(3, 7, {hasMoved: false, side: 'black', type: 'queen', alive: true});
        setGridAtIndex(4, 7, {hasMoved: false, side: 'black', type: 'king', alive: true});
        setGridAtIndex(5, 7, {hasMoved: false, side: 'black', type: 'bishop', alive: true});
        setGridAtIndex(6, 7, {hasMoved: false, side: 'black', type: 'knight', alive: true});
        setGridAtIndex(7, 7, {hasMoved: false, side: 'black', type: 'rook', alive: true});
    }, []);


    // @ts-ignore
    return <Board grid={grid} setGridAtIndex={setGridAtIndex}/>
}

