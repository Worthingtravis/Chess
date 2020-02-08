import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Piece, Point, SelectedPiece } from "./global.interfaces";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  Icon
} from "@material-ui/core";

export function Board({
  grid,
  setGridAtIndex
}: {
  grid: any;
  setGridAtIndex: any;
}): any {
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
    return side === "white"
      ? whiteHistory.length > blackHistory.length
      : blackHistory.length >= whiteHistory.length;
  }

  function MoveValidation(x: any, y: any, selectedPiece: SelectedPiece): any {
    const type = selectedPiece.piece.type;
    const { side } = selectedPiece.piece;
    const { x: x2, y: y2 } = selectedPiece.point;

    let m = side === "white" ? 1 : -1;
    let distance;
    let direction;
    let origin;
    let valid = false;
    let turns = false;

    if (sideToMove(side) && turns) {
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
        if (validateVerticalHorizontal(x, y, x2, y2)) {
          setGridAtIndex(x, y, selectedPiece.piece);
          setGridAtIndex(x2, y2, "");
          setSelectedPiece(undefined);
          valid = true;
        }
        break;
      case "bishop":
        if (validateDiagonal(x, y, x2, y2)) {
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
        if (
          validateDiagonal(x, y, x2, y2) ||
          validateVerticalHorizontal(x, y, x2, y2)
        ) {
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

  function inRange(
    x0: number,
    x: number,
    xArray: { [x: string]: any },
    yArray: { [x: string]: any }
  ): boolean {
    for (let i = 1; i < xArray.length; i++) {
      if (grid[xArray[i]][yArray[i]]) {
        if (i === xArray.length - 1) {
          return (
            selectedPiece !== undefined &&
            selectedPiece.piece.side !== grid[xArray[i]][yArray[i]].side
          );
        } else {
          return false;
        }
      }
    }
    return true;
  }

  function validateDiagonal(x: number, y: number, x0: number, y0: number) {
    let subY = y - y0;
    let subX = x - x0;
    let slope = subY / subX;
    if (Math.abs(slope) !== 1) return false;

    let xArray = range(x0, x, 1);
    let yArray = range(y0, y, 1);
    console.log(inRange(x0, x, xArray, yArray));
    return inRange(x0, x, xArray, yArray);
  }

  function range(start: any, end: any, step: any) {
    var range = [];

    if (step === 0) {
      throw TypeError("Step cannot be zero.");
    }

    typeof step == "undefined" && (step = 1);

    if (end < start) {
      step = -step;
    }

    while (step > 0 ? end >= start : end <= start) {
      range.push(start);
      start += step;
    }
    return range;
  }

  // A rook can only move in a straight line.
  function validateVerticalHorizontal(
    x: number,
    y: number,
    x2: number,
    y2: number
  ) {
    let XR = range(x2, x, 1);
    let YR = range(y2, y, 1);

    let subY = y - y2;
    let subX = x - x2;
    let slope = subY / subX;

    if (Math.abs(slope) === 1) return false;
    if (y !== y2 && x !== x2) return false;

    let largerArray = XR.length > YR.length ? XR : YR;
    let smallerArray = XR.length < YR.length ? XR : YR;

    largerArray.forEach((value, key) => {
      smallerArray.push(smallerArray[0]);
    });

    smallerArray.pop();

    return inRange(x2, x, XR, YR);
  }

  function validateKing(x: number, y: number, x2: number, y2: number) {
    return (
      (x2 === x && (y2 === y + 1 || y2 === y - 1)) ||
      (y2 === y && (x2 === x + 1 || x2 === x - 1)) ||
      ((y2 === y + 1 || y2 === y - 1) && (x2 === x + 1 || x2 === x - 1))
    );
  }

  function getPieceAtCoord(x: any, y: any, event: React.MouseEvent<HTMLTableDataCellElement, MouseEvent>): any {
    x = x - 1;
    y = y - 1;

    //If you have already selected a piece
    if (selectedPiece && selectedPiece.piece && selectedPiece.piece.side) {
      //and the square you selected has a piece on it.
      if (grid[x] && grid[x][y]) {
        let tempPiece: SelectedPiece = { piece: grid[x][y], point: { x, y } };

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
    return <tr id={castRow}>{renderColumns(castRow)}</tr>;
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

              <div className={'history_label'}>

                {getFontAwesomeIcon(item.piece)}

              <div className={'piece_text'}>  {type[0].toUpperCase()+type[1]}</div>
              </div>
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
