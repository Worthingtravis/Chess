import React, {useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
    faChessQueen,
    faChessKing,
    faChessBishop,
    faChessKnight,
    faChessPawn,
    faChessRook
} from "@fortawesome/free-solid-svg-icons";
import {Piece, SelectedPiece} from "./global.interfaces";
import {
    Card,
    CardContent,
    Typography,
    List,
    ListItem,
} from '@material-ui/core';


// @ts-ignore
export function Board({grid, setGridAtIndex}) {
    let [selectedPiece, setSelectedPiece] = useState<SelectedPiece>();
    let [selectedTarget, setSelectedTarget] = useState<any>();


    function updateSelectedTarget(target: any) {
        if (target) {
            console.log(target);
            console.log(target.cellIndex);
            if (selectedTarget) {
                selectedTarget.classList.remove("selected");
            }
            setSelectedTarget(target);
            target.classList.add("selected");
        } else {
            if (selectedTarget)
                selectedTarget.classList.remove("selected");
        }

    }


    function getPieceIcon(gridElementElement: any) {
        // @ts-ignore
        let type = gridElementElement.type || '';
        switch (type) {
            case 'pawn':
                return faChessPawn;
            case 'rook':
                return faChessRook;
            case 'bishop':
                return faChessBishop;
            case 'knight':
                return faChessKnight;
            case 'queen':
                return faChessQueen;
            case 'king':
                return faChessKing;
            default:
                return '';
        }
    }

    function getPieceColor(gridElementElement: Piece) {
        // @ts-ignore
        let side = gridElementElement.side || '';
        switch (side) {
            case 'white':
                return '#becabf';
            case 'black':
                return '#000000';
            default:
                return 'green';
        }
    }

    function getRotation(gridElementElement: Piece) {
        // @ts-ignore
        if (gridElementElement.side === 'black') {
            return 180;
        }
    }

    // @ts-ignore
    function getPieceAtSlot(x: any, y: any): any {
        x = (x - 1);
        y = (y - 1);
        if (grid[x] && grid[x][y]) { // @ts-ignore
            let piece = grid[x][y];
            // @ts-ignore
            return <FontAwesomeIcon
                // @ts-ignore
                icon={getPieceIcon(piece)}
                className={'ChessIcons'}
                // @ts-ignore
                rotation={getRotation(piece)}
                color={getPieceColor(piece)}
            />
        }
    }


    function validateKnight(x: number, y: number, x2: number, y2: number) {
        let x2sub_two = x2 - 2;
        let x2max_two = x2 + 2;

        let x2sub_one = x2 - 1;
        let x2max_one = x2 + 1;

        let y2sub_two = y2 - 2;
        let y2max_two = y2 + 2;

        let y2sub_one = y2 - 1;
        let y2max_one = y2 + 1;

        return (((y === y2sub_two || y === y2max_two) && (x === x2sub_one || x === x2max_one)) ||
            ((x === x2sub_two || x === x2max_two) && (y === y2sub_one || y === y2max_one))
        )
    }

    function MoveValidation(x: any, y: any, selectedPiece: SelectedPiece): any {
        // @ts-ignore
        const {type, side} = selectedPiece.piece;
        const {x: x2, y: y2} = selectedPiece.point;

        let m = side === 'white' ? 1 : -1;
        let distance;
        let direction;
        let origin;
        switch (type) {
            case 'pawn':
                distance = selectedPiece.piece.hasMoved ? 1 : 2;
                direction = m * y2;
                origin = m * y;
                if ((direction >= (origin - distance) && direction < origin)) {
                    if (x === x2) {
                        selectedPiece.piece.hasMoved = true;
                        setGridAtIndex(x, y, selectedPiece.piece);
                        setGridAtIndex(x2, y2, '');
                        //always unselect the piece on success
                        setSelectedPiece(undefined);
                    }
                }
                break;
            case 'rook':
                if (validateRook(x, y, x2, y2)) {
                    setGridAtIndex(x, y, selectedPiece.piece);
                    setGridAtIndex(x2, y2, '');
                    //always unselect the piece on success
                    setSelectedPiece(undefined);
                }
                break;
            case 'bishop':
                if (validateBishop(x, y, x2, y2)) {
                    // console.log(x, y, x2, y2);
                    setGridAtIndex(x, y, selectedPiece.piece);
                    setGridAtIndex(x2, y2, '');
                    //always unselect the piece on success
                    setSelectedPiece(undefined);
                }
                break;
            case 'knight':
                if (validateKnight(x, y, x2, y2)) {
                    setGridAtIndex(x, y, selectedPiece.piece);
                    setGridAtIndex(x2, y2, '');
                    //always unselect the piece on success
                    setSelectedPiece(undefined);
                }
                return true;
            case 'queen':
                if (validateBishop(x, y, x2, y2) || validateRook(x, y, x2, y2)) {
                    setGridAtIndex(x, y, selectedPiece.piece);
                    setGridAtIndex(x2, y2, '');
                    //always unselect the piece on success
                    setSelectedPiece(undefined);
                }
                break;
            case 'king':
                if (validateKing(x, y, x2, y2)) {
                    setGridAtIndex(x, y, selectedPiece.piece);
                    setGridAtIndex(x2, y2, '');
                    //always unselect the piece on success
                    setSelectedPiece(undefined);
                }
                break;
            default:
                setSelectedPiece(undefined);
        }
    }

    // A bishop can only move along the diagonal.
    // For X and Y Terminology,
    // If X is changing; Y has to be changing at the same rate.
    // example: if x goes from 1 -> 2, then Y has to move to 2 or -2
    // example: if y goes from -1 -> -2, then Y has to move to 2 or -2
    function validateBishop(x: number, y: number, x2: number, y2: number) {
        let subY = y2 - y;
        let subX = x2 - x;

         if (((subX)/(subY)) === 1){
             for (let i = subX; i <= x; i-- ) {
                 console.log(i)
             }
         }
         return true
    }

    // A rook can only move in a straight line.
    function validateRook(x: number, y: number, x2: number, y2: number) {
        function validateXorY(a: number, b: number, a2: number, b2: number, forX: boolean = true) {
            // If X is changing; Y CANT change..
            // Respectively, if Y is changing, X CANT change.
            if (b2 === b && a2 !== a) {
                if (a < a2) {
                    for (let i = a; i < a2; i++) {
                        if (forX) {
                            if (grid[i][b]) return false;
                        } else {
                            if (grid[b][i]) return false;
                        }
                    }
                }
                if (a > a2) {
                    for (let i = a; i > a2; i--) {
                        if (forX) {
                            if (grid[i][b]) return false;
                        } else {
                            if (grid[b][i]) return false;
                        }
                    }
                }
                return true
            }
            return true
        }

        // ensure the rook isn't passing through any pieces along the way
        return validateXorY(x, y, x2, y2) && validateXorY(y, x, y2, x2, false);
    }

    function validateKing(x: number, y: number, x2: number, y2: number) {
        return (x2 === x && (y2 === y + 1 || y2 === y - 1)) ||
            (y2 === y && (x2 === x + 1 || x2 === x - 1)) ||
            ((y2 === y + 1 || y2 === y - 1) && (x2 === x + 1 || x2 === x - 1))
    }

// @ts-ignore
    function getPieceAtCoord(x: any, y: any, event): any {

        x = (x - 1);
        y = (y - 1);
        // event.currentTarget.classList.remove("selected");

        //If you have already selected a piece
        if (selectedPiece && selectedPiece.piece && selectedPiece.piece.side) {
            console.log(selectedPiece.piece.side);
            //and the square you selected has a piece on it.
            if (grid[x] && grid[x][y]) {
                let tempPiece: SelectedPiece = {piece: grid[x][y], point: {x, y}};

                console.log('a piece was selected, and there is a piece here.');
                //and the previously selected piece is not the same color as the newly selected piece
                if (selectedPiece.piece.side !== tempPiece.piece.side) {
                    MoveValidation(x, y, selectedPiece);
                } else {
                    setSelectedPiece(tempPiece);
                    updateSelectedTarget(event.currentTarget)
                }
            }
            //and the square you selected does NOT have a piece on it.
            else {
                MoveValidation(x, y, selectedPiece);
                setSelectedPiece(undefined);
                updateSelectedTarget(undefined)
            }
        }
        //If you do not have a piece already selected
        else {

            //but the square you clicked on has a piece on it.
            if (grid[x] && grid[x][y]) {
                let tempPiece: SelectedPiece = {piece: grid[x][y], point: {x, y}};
                setSelectedPiece(tempPiece);
                updateSelectedTarget(event.currentTarget)
            } else {
                setSelectedPiece(undefined);
                updateSelectedTarget(undefined)
            }
        }
    }


    function renderCols(row: number) {
        return <>
            <tr id={String(row)}>
                <td onClick={(e) => getPieceAtCoord(1, String(row), e)}>{getPieceAtSlot(1, String(row))} </td>
                <td onClick={(e) => getPieceAtCoord(2, String(row), e)}>{getPieceAtSlot(2, String(row))}</td>
                <td onClick={(e) => getPieceAtCoord(3, String(row), e)}>{getPieceAtSlot(3, String(row))}</td>
                <td onClick={(e) => getPieceAtCoord(4, String(row), e)}>{getPieceAtSlot(4, String(row))}</td>
                <td onClick={(e) => getPieceAtCoord(5, String(row), e)}>{getPieceAtSlot(5, String(row))}</td>
                <td onClick={(e) => getPieceAtCoord(6, String(row), e)}>{getPieceAtSlot(6, String(row))}</td>
                <td onClick={(e) => getPieceAtCoord(7, String(row), e)}>{getPieceAtSlot(7, String(row))}</td>
                <td onClick={(e) => getPieceAtCoord(8, String(row), e)}>{getPieceAtSlot(8, String(row))}</td>
            </tr>
        </>

    }

    function renderBoard() {
        return <>

            {renderCols(8)}
            {renderCols(7)}
            {renderCols(6)}
            {renderCols(5)}
            {renderCols(4)}
            {renderCols(3)}
            {renderCols(2)}
            {renderCols(1)}

        </>
    }

    function getTypography() {
        if (selectedPiece)
            (10 + selectedPiece.point.x).toString(36);
        return (selectedPiece && selectedPiece.point && <> {(10 + selectedPiece.point.x).toString(36).toUpperCase()}{selectedPiece.point.y + 1} </>) || <>&nbsp;</>;
    }

    return <>
        <Card>
            <CardContent>
                <table id={'chess_board'}>
                    <tbody>
                    {renderBoard()}
                    </tbody>
                </table>

                <List style={{textAlign: 'center'}}>
                    <ListItem style={{textAlign: 'center'}}>
                        <Typography>
                            {getTypography()}
                        </Typography>
                    </ListItem>
                </List>
            </CardContent>
        </Card>
    </>;
}
