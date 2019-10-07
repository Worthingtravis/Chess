import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChessQueen,
  faChessKing,
  faChessBishop,
  faChessKnight,
  faChessPawn,
  faChessRook,
  IconDefinition
} from "@fortawesome/free-solid-svg-icons";
import { Piece, Point, SelectedPiece } from "./global.interfaces";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  Icon
} from "@material-ui/core";

// @ts-ignore
export function Board({ grid, setGridAtIndex }) {
  let [selectedPiece, setSelectedPiece] = useState<SelectedPiece>();
  let [selectedTarget, setSelectedTarget] = useState<any>();
  let [blackHistory, setBlackHistory] = useState<SelectedPiece[]>([]);
  let [whiteHistory, setWhiteHistory] = useState<SelectedPiece[]>([]);
  let [viewSide, setViewSide] = useState<any>({ white: true });

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
      if (selectedTarget) selectedTarget.classList.remove("selected");
    }
  }

  function getPieceIcon(
    gridElementElement: "pawn" | "rook" | "knight" | "bishop" | "queen" | "king"
  ): IconDefinition | null {
    // @ts-ignore
    let type = gridElementElement.type || "";
    switch (type) {
      case "pawn":
        return faChessPawn;
      case "rook":
        return faChessRook;
      case "bishop":
        return faChessBishop;
      case "knight":
        return faChessKnight;
      case "queen":
        return faChessQueen;
      case "king":
        return faChessKing;
      default:
        return null;
    }
  }

  function getFontAwesomeIcon(piece: Piece) {
    return (
      <FontAwesomeIcon
        // @ts-ignore
        icon={piece.icon}
        className={"ChessIcons"}
        color={piece.side === "white" ? "whitesmoke" : "burlywood"}
      />
    );
  }

  // @ts-ignore
  function getPieceAtSlot(x: any, y: any): any {
    x = x - 1;
    y = y - 1;
    if (grid[x] && grid[x][y]) {
      // @ts-ignore
      let piece: Piece = grid[x][y];
      // @ts-ignore
      return getFontAwesomeIcon(piece);
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

    return (
      ((y === y2sub_two || y === y2max_two) &&
        (x === x2sub_one || x === x2max_one)) ||
      ((x === x2sub_two || x === x2max_two) &&
        (y === y2sub_one || y === y2max_one))
    );
  }

  function sideToMove(side: "white" | "black") {
    return false;
    return side === "white"
      ? whiteHistory.length > blackHistory.length
      : blackHistory.length >= whiteHistory.length;
  }

  function MoveValidation(x: any, y: any, selectedPiece: SelectedPiece): any {
    // @ts-ignore
    const type = selectedPiece.piece.type;
    const { side } = selectedPiece.piece;
    const { x: x2, y: y2 } = selectedPiece.point;

    let m = side === "white" ? 1 : -1;
    let distance;
    let direction;
    let origin;
    let valid = false;
    if (sideToMove(side)) {
      return false;
    }

    switch (type) {
      case "pawn":
        distance = selectedPiece.piece.hasMoved ? 1 : 2;
        direction = m * y2;
        origin = m * y;
        if (direction >= origin - distance && direction < origin) {
          if (x === x2) {
            selectedPiece.piece.hasMoved = true;
            setGridAtIndex(x, y, selectedPiece.piece);
            setGridAtIndex(x2, y2, "");
            setSelectedPiece(undefined);
            valid = true;
          }
        }
        break;
      case "rook":
        if (validateRook(x, y, x2, y2)) {
          setGridAtIndex(x, y, selectedPiece.piece);
          setGridAtIndex(x2, y2, "");
          setSelectedPiece(undefined);
          valid = true;
        }
        break;
      case "bishop":
        if (validateBishop(x, y, x2, y2)) {
          // console.log(x, y, x2, y2);
          setGridAtIndex(x, y, selectedPiece.piece);
          setGridAtIndex(x2, y2, "");
          setSelectedPiece(undefined);
          valid = true;
        }
        break;
      case "knight":
        if (validateKnight(x, y, x2, y2)) {
          setGridAtIndex(x, y, selectedPiece.piece);
          setGridAtIndex(x2, y2, "");
          setSelectedPiece(undefined);
          valid = true;
        }
        break;
      case "queen":
        if (validateBishop(x, y, x2, y2) || validateRook(x, y, x2, y2)) {
          setGridAtIndex(x, y, selectedPiece.piece);
          setGridAtIndex(x2, y2, "");
          setSelectedPiece(undefined);
          valid = true;
        }
        break;
      case "king":
        if (validateKing(x, y, x2, y2)) {
          setGridAtIndex(x, y, selectedPiece.piece);
          setGridAtIndex(x2, y2, "");
          setSelectedPiece(undefined);
          valid = true;
        }
        break;
      default:
        setSelectedPiece(undefined);
        valid = false;
    }
    // @ts-ignore

    if (selectedPiece.piece.side === "black" && valid) {
      setBlackHistory(blackHistory => [
        ...blackHistory,
        { piece: selectedPiece.piece, point: { x, y } }
      ]);
    }
    if (selectedPiece.piece.side === "white" && valid) {
      setWhiteHistory(whiteHistory => [
        ...whiteHistory,
        { piece: selectedPiece.piece, point: { x, y } }
      ]);
    }
  }

  // A bishop can only move along the diagonal.
  // For X and Y Terminology,
  // If X is changing; Y has to be changing at the same rate.
  // example: if x goes from 1 -> 2, then Y has to move to 2 or -2
  // example: if y goes from -1 -> -2, then Y has to move to 2 or -2
  const difference = function(a: number, b: number) {
    return Math.abs(a - b);
  };

  function validateBishop(x: number, y: number, x0: number, y0: number) {
    let subY = y - y0;
    let subX = x - x0;

    let slope = subY / subX;
    console.group("Validate Bishop");
    console.log("subX", subX);
    console.log("subY", subY);
    if (Math.abs(slope) !== 1) return false;

    x > x0
      ? console.log("right", "from", x0, "to", x, "distance of", subX)
      : console.log("left", x - x0);
    y > y0 ? console.log("up", y - y0) : console.log("down", y - y0);

    x > x0
      ? console.log("right", "from", x0, "to", x, "distance of", subX)
      : console.log("left", x - x0);

    let xHigh, xLow, yHigh, yLow;
    let dx = 1;
    let dy = 1;

    if (x > x0) {
      xHigh = x;
      xLow = x0;
    } else {
      dx = -1;
      xHigh = x0;
      xLow = x;
    }

    if (y > y0) {
      yHigh = y;
      yLow = y0;
    } else {
      dy = -1;
      yHigh = y0;
      yLow = y;
    }
    console.log("starting");


    // if (((subX)/(subY)) === 1){
    //     for (let i = x2+1; i <= x; i++ ) {
    //         console.log('AA',i);
    //
    //         if (grid[i][i]){
    //             console.log('grid piece found')
    //         }
    //
    //         if ( Math.abs(i) >= 100){
    //             console.log('loop broke', i)
    //             return false;
    //         }
    //
    //     }
    // }

    //BB
    // if (Math.abs(m) === 1) {
    //   if (x < x2)
    //     for (let i = x2; i >= x; i--) {
    //       console.log(x + i + m, y + i - m);
    //
    //       if (grid[x + i + m][y + i + m]) {
    //         // console.log(grid[(x+i)+m][(y+i)+m])
    //         return false;
    //       }
    //
    //       if (Math.abs(i) >= 100) {
    //         console.log("loop broke", i);
    //         return false;
    //       }
    //     }
    // }
    console.groupEnd();

    return true;
  }

  // A rook can only move in a straight line.
  function validateRook(x: number, y: number, x2: number, y2: number) {
    function validateXorY(
      a: number,
      b: number,
      a2: number,
      b2: number,
      forX: boolean = true
    ) {
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
        return true;
      }
      return true;
    }

    // ensure the rook isn't passing through any pieces along the way
    return validateXorY(x, y, x2, y2) && validateXorY(y, x, y2, x2, false);
  }

  function validateKing(x: number, y: number, x2: number, y2: number) {
    return (
      (x2 === x && (y2 === y + 1 || y2 === y - 1)) ||
      (y2 === y && (x2 === x + 1 || x2 === x - 1)) ||
      ((y2 === y + 1 || y2 === y - 1) && (x2 === x + 1 || x2 === x - 1))
    );
  }

  // @ts-ignore
  function getPieceAtCoord(x: any, y: any, event): any {
    x = x - 1;
    y = y - 1;
    // event.currentTarget.classList.remove("selected");

    //If you have already selected a piece
    if (selectedPiece && selectedPiece.piece && selectedPiece.piece.side) {
      console.log(selectedPiece.piece.side);
      //and the square you selected has a piece on it.
      if (grid[x] && grid[x][y]) {
        let tempPiece: SelectedPiece = { piece: grid[x][y], point: { x, y } };

        console.log("a piece was selected, and there is a piece here.");
        //and the previously selected piece is not the same color as the newly selected piece
        if (selectedPiece.piece.side !== tempPiece.piece.side) {
          MoveValidation(x, y, selectedPiece);
        } else {
          setSelectedPiece(tempPiece);
          updateSelectedTarget(event.currentTarget);
        }
      }
      //and the square you selected does NOT have a piece on it.
      else {
        MoveValidation(x, y, selectedPiece);
        setSelectedPiece(undefined);
        updateSelectedTarget(undefined);
      }
    }
    //If you do not have a piece already selected
    else {
      //but the square you clicked on has a piece on it.
      if (grid[x] && grid[x][y]) {
        let tempPiece: SelectedPiece = { piece: grid[x][y], point: { x, y } };
        setSelectedPiece(tempPiece);
        updateSelectedTarget(event.currentTarget);
      } else {
        setSelectedPiece(undefined);
        updateSelectedTarget(undefined);
      }
    }
  }

  function renderColumns(castRow: string) {
    const columns = [1, 2, 3, 4, 5, 6, 7, 8];
    return columns.map(i => {
      return (
        <td onClick={e => getPieceAtCoord(i, castRow, e)}>
          {getPieceAtSlot(i, castRow)}{" "}
        </td>
      );
    });
  }

  function renderRows(row: number) {
    const castRow = String(row);
    return (
      <>
        <tr id={castRow}>{renderColumns(castRow)}</tr>
      </>
    );
  }

  function renderBoard() {
    let rows = [8, 7, 6, 5, 4, 3, 2, 1];
    if (viewSide.white !== true) rows = rows.reverse();
    return rows.map(i => {
      return renderRows(i);
    });
  }

  function getTypographyFromCoord(
    historyArray: SelectedPiece[],
    isWhite: boolean
  ) {
    return (
      (historyArray &&
        historyArray.length > 0 &&
        historyArray.map((item: SelectedPiece) => {
          const { type } = item.piece;
          return (
            <Typography
              style={{
                fontSize: 16
              }}
            >
              {/*{type[0].toUpperCase()+type[1]}*/}

              {getFontAwesomeIcon(item.piece)}
              {(10 + item.point.x).toString(36).toUpperCase()}
              {item.point.y + 1}
              <Icon style={{ fontSize: 20 }}>subdirectory_arrow_right</Icon>
            </Typography>
          );
          //to avoid over flow on screen
        })) || <Typography> &nbsp; </Typography>
    );
  }

  return (
    <Card>
      <CardContent style={{ display: "flex" }}>
        {" "}
        <List disablePadding={true} color={"primary"}>
          <ListItem className={"moveHistory"}>
            {getTypographyFromCoord(blackHistory, false)}
          </ListItem>
          <ListItem className={"moveHistory"}>
            {getTypographyFromCoord(whiteHistory, true)}
          </ListItem>
        </List>
        <table id={"chess_board"}>
          <tbody>{renderBoard()}</tbody>
          <p className={"pHelper"}>
            <td className={"helper"}>A</td>
            <td className={"helper"}>B</td>
            <td className={"helper"}>C</td>
            <td className={"helper"}>D</td>
            <td className={"helper"}>E</td>
            <td className={"helper"}>F</td>
            <td className={"helper"}>G</td>
            <td className={"helper"}>H</td>
          </p>
        </table>
      </CardContent>
    </Card>
  );
}
