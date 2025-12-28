import { Scanner } from "./components/scanner";

// const board = new Board([
//   [
//     { color: "green", value: 6 },
//     { color: "purple", value: 5 },
//     { color: "blue", value: 1 },
//     { color: "red", value: 6 },
//     { color: "yellow", value: 5 },
//   ],
//   [
//     { color: "yellow", value: 5 },
//     { color: "red", value: 6 },
//     { color: "purple", value: 5 },
//     { color: "blue", value: 2 },
//     { color: "green", value: 1 },
//   ],
//   [
//     { color: "red", value: 4 },
//     null,
//     { color: "yellow", value: 1 },
//     { color: "purple", value: 6 },
//     null,
//   ],
//   [
//     { color: "yellow", value: 6 },
//     { color: "red", value: 2 },
//     { color: "blue", value: 5 },
//     null,
//     { color: "yellow", value: 3 },
//   ],
// ]);

export function App() {
  // const scoring = colorDiagonals(board);

  return (
    <div>
      <Scanner />
      {/* <PublicObjectives /> */}
      {/* <BoardView board={board} mask={scoring.mask} /> */}
      {/* {scoring.calculation}
      {" = "}
      <strong>{scoring.score}</strong> */}
    </div>
  );
}

export default App;
