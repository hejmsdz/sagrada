import type { PublicObjectiveName } from "@/game/public-objectives";
import type { Color } from "@/game/types";
import { Board, type OptionalDice } from "@/game/types";
import { create } from "zustand";

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
};

export const MAX_FAVOR_TOKENS = 6;

type Player = State["players"][number];

function updatePlayer(
  set: (updater: (state: State) => Partial<State>) => void,
  playerId: number,
  update: (player: Player) => Player,
) {
  set((prevState) => ({
    players: prevState.players.map((player, index) =>
      index === playerId ? update(player) : player,
    ),
  }));
}

export const useStore = create<State>((set) => ({
  publicObjectives: [],
  players: [{}],
  togglePublicObjective: (objectiveName, isSelected) => {
    set((prevState) => ({
      publicObjectives: isSelected
        ? [...prevState.publicObjectives, objectiveName]
        : prevState.publicObjectives.filter((name) => name !== objectiveName),
    }));
  },
  setPlayerBoard: (playerId: number, board: Board) => {
    updatePlayer(set, playerId, () => ({
      board,
    }));
  },
  updateDice: (
    playerId: number,
    rowIndex: number,
    columnIndex: number,
    dice: OptionalDice,
  ) => {
    updatePlayer(set, playerId, (player) => ({
      board: Board.build((row, column) => {
        if (row === rowIndex && column === columnIndex) {
          return dice;
        }

        return player.board?.at(row, column) ?? null;
      }),
    }));
  },
  setPlayerPrivateObjective: (playerId: number, color: Color) => {
    updatePlayer(set, playerId, () => ({
      privateObjective: color,
    }));
  },
  incrementFavorTokens: (playerId: number) => {
    updatePlayer(set, playerId, (player) => ({
      favorTokens: Math.min((player.favorTokens ?? 0) + 1, MAX_FAVOR_TOKENS),
    }));
  },
  decrementFavorTokens: (playerId: number) => {
    updatePlayer(set, playerId, (player) => ({
      favorTokens: Math.max((player.favorTokens ?? 0) - 1, 0),
    }));
  },
}));
