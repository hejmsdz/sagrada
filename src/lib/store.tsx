import type { Color } from "@/game/types";
import { Board, type OptionalDice } from "@/game/types";
import { create } from "zustand";

export type State = {
  publicObjectives: string[]; // todo: keyof
  players: {
    name?: string;
    board?: Board;
    privateObjective?: Color;
    favorTokens?: number;
  }[];
  togglePublicObjective: (objectiveName: string, isSelected: boolean) => void;
  setPlayerBoard: (playerId: number, board: Board) => void;
  updateDice: (
    playerId: number,
    rowIndex: number,
    columnIndex: number,
    dice: OptionalDice,
  ) => void;
};

export const useStore = create<State>((set) => ({
  publicObjectives: [] as string[],
  players: [
    {
      board: Board.build(() => null),
    },
  ],
  togglePublicObjective: (objectiveName, isSelected) => {
    set((prevState) => ({
      publicObjectives: isSelected
        ? [...prevState.publicObjectives, objectiveName]
        : prevState.publicObjectives.filter((name) => name !== objectiveName),
    }));
  },
  setPlayerBoard: (playerId: number, board: Board) => {
    set((prevState) => ({
      players: prevState.players.map((player, index) => {
        if (index !== playerId) {
          return player;
        }

        return {
          ...player,
          board,
        };
      }),
    }));
  },
  updateDice: (
    playerId: number,
    rowIndex: number,
    columnIndex: number,
    dice: OptionalDice,
  ) => {
    set((prevState) => ({
      players: prevState.players.map((player, index) => {
        if (index !== playerId || !player.board) {
          return player;
        }

        return {
          ...player,
          board: Board.build((row, column) => {
            if (row === rowIndex && column === columnIndex) {
              return dice;
            }

            return player.board?.at(row, column) ?? null;
          }),
        };
      }),
    }));
  },
}));
