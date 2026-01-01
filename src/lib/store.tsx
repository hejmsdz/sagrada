import type { PublicObjectiveName } from "@/game/public-objectives";
import type { Color } from "@/game/types";
import { Board, NUM_COLUMNS, NUM_ROWS, type OptionalDice } from "@/game/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type State = {
  publicObjectives: PublicObjectiveName[];
  players: {
    name?: string;
    board?: Board;
    privateObjective?: Color;
    favorTokens?: number;
  }[];
  togglePublicObjective: (
    objectiveName: PublicObjectiveName,
    isSelected: boolean,
  ) => void;
  setPlayerBoard: (playerId: number, board: Board) => void;
  updateDice: (
    playerId: number,
    rowIndex: number,
    columnIndex: number,
    dice: OptionalDice,
  ) => void;
  setPlayerPrivateObjective: (playerId: number, color: Color) => void;
  incrementFavorTokens: (playerId: number) => void;
  decrementFavorTokens: (playerId: number) => void;
  setPlayerName: (playerId: number, name: string) => void;
  addPlayer: () => number;
  resetStore: () => void;
};

export const REQUIRED_PUBLIC_OBJECTIVES = 3;
export const MAX_FAVOR_TOKENS = 6;
export const MAX_PLAYERS = 4;

export type Player = State["players"][number];

function updatePlayer(playerId: number, update: (player: Player) => Player) {
  return (prevState: State) => ({
    players: prevState.players.map((player, index) =>
      index === playerId ? { ...player, ...update(player) } : player,
    ),
  });
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      publicObjectives: [],
      players: [{}],
      togglePublicObjective: (objectiveName, isSelected) => {
        set((prevState) => ({
          publicObjectives: isSelected
            ? [...prevState.publicObjectives, objectiveName]
            : prevState.publicObjectives.filter(
                (name) => name !== objectiveName,
              ),
        }));
      },
      setPlayerBoard: (playerId: number, board: Board) => {
        set(
          updatePlayer(playerId, () => ({
            board,
          })),
        );
      },
      updateDice: (
        playerId: number,
        rowIndex: number,
        columnIndex: number,
        dice: OptionalDice,
      ) => {
        set(
          updatePlayer(playerId, (player) => ({
            board: Board.build((row, column) => {
              if (row === rowIndex && column === columnIndex) {
                return dice;
              }

              return player.board?.at(row, column) ?? null;
            }),
          })),
        );
      },
      setPlayerPrivateObjective: (playerId: number, color: Color) => {
        set(
          updatePlayer(playerId, () => ({
            privateObjective: color,
          })),
        );
      },
      incrementFavorTokens: (playerId: number) => {
        set(
          updatePlayer(playerId, (player) => ({
            favorTokens: Math.min(
              (player.favorTokens ?? 0) + 1,
              MAX_FAVOR_TOKENS,
            ),
          })),
        );
      },
      decrementFavorTokens: (playerId: number) => {
        set(
          updatePlayer(playerId, (player) => ({
            favorTokens: Math.max((player.favorTokens ?? 0) - 1, 0),
          })),
        );
      },
      setPlayerName: (playerId: number, name: string) => {
        set(updatePlayer(playerId, () => ({ name })));
      },
      addPlayer: () => {
        const newPlayerId = get().players.length;
        set((prevState) => ({ players: [...prevState.players, {}] }));

        return newPlayerId;
      },
      resetStore: () => {
        set({
          publicObjectives: [],
          players: [{}],
        });
      },
    }),
    {
      name: "sagrada",
      storage: createJSONStorage(() => sessionStorage, {
        reviver(key, value) {
          if (
            key === "board" &&
            typeof value === "object" &&
            value !== null &&
            "board" in value
          ) {
            if (
              Array.isArray(value.board) &&
              value.board.length === NUM_ROWS &&
              value.board.every(
                (row) =>
                  Array.isArray(row) &&
                  row.length === NUM_COLUMNS &&
                  row.every(
                    (cell) =>
                      (typeof cell === "object" && cell === null) ||
                      ("color" in cell && "value" in cell),
                  ),
              )
            ) {
              return new Board(value.board);
            }
          }
          return value;
        },
      }),
    },
  ),
);
