export type Color = "blue" | "green" | "purple" | "red" | "yellow";
export type Value = number;

export const COLORS: Color[] = ["blue", "green", "purple", "red", "yellow"];
export const VALUES: Value[] = [1, 2, 3, 4, 5, 6];

export type Dice = {
  color: Color;
  value: Value;
};
export type OptionalDice = Dice | null;

export const NUM_ROWS = 4;
export const NUM_COLUMNS = 5;

export type Coordinate = readonly [number, number];

export class Board {
  private board: OptionalDice[][];

  constructor(board: OptionalDice[][]) {
    const isValid =
      board.length === NUM_ROWS &&
      board.every((row) => row.length === NUM_COLUMNS);
    if (!isValid) {
      throw new RangeError(`Invalid board size`);
    }

    this.board = board;
  }

  static build(builder: (row: number, column: number) => OptionalDice): Board {
    return new Board(
      new Array(NUM_ROWS)
        .fill(null)
        .map((_, row) =>
          new Array(NUM_COLUMNS)
            .fill(null)
            .map((_, column) => builder(row, column)),
        ),
    );
  }

  static validCoordinates(row: number, column: number): boolean {
    return row >= 0 && row < NUM_ROWS && column >= 0 && column < NUM_COLUMNS;
  }

  static neighbors(row: number, column: number): Coordinate[] {
    return ([
      [row - 1, column],
      [row + 1, column],
      [row, column - 1],
      [row, column + 1],
    ] satisfies Coordinate[])
      .filter(([row, column]) => Board.validCoordinates(row, column));
  }

  at(row: number, column: number): OptionalDice {
    return this.board[row][column];
  }

  forEach(
    callback: (
      dice: OptionalDice,
      rowIndex: number,
      columnIndex: number,
    ) => void,
  ): void {
    this.board.forEach((row, rowIndex) =>
      row.forEach((dice, columnIndex) => callback(dice, rowIndex, columnIndex)),
    );
  }

  createMask(
    predicate: (
      dice: OptionalDice,
      rowIndex: number,
      columnIndex: number,
    ) => boolean,
  ): Mask {
    return this.board.map((row, rowIndex) =>
      row.map((dice, columnIndex) => predicate(dice, rowIndex, columnIndex)),
    );
  }

  diceAtMask(mask: Mask): OptionalDice[] {
    const matchingDice: OptionalDice[] = [];
    for (let row = 0; row < NUM_ROWS; row++) {
      for (let column = 0; column < NUM_COLUMNS; column++) {
        if (mask[row][column]) {
          matchingDice.push(this.at(row, column));
        }
      }
    }
    return matchingDice;
  }

  findIllegallyPlacedDice(): Mask {
    return this.createMask((dice, i, j) => {
      if (dice === null) {
        return false;
      }

      return Board.neighbors(i, j)
        .some(([row, column]) => {
          const neighbor = this.at(row, column);

          if (neighbor === null) {
            return false;
          }

          const isSameValue = neighbor.value === dice.value;
          const isSameColor = neighbor.color === dice.color;

          return isSameValue || isSameColor;
        });
    });
  }
}
export type Mask = boolean[][];
