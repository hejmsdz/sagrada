import { useGameStore } from "@/stores/game";
import { useEffect } from "react";

export function useBeforeUnload() {
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      const state = useGameStore.getState();

      const isDirty =
        state.publicObjectives.length > 0 ||
        state.players.some((player) => Object.keys(player).length > 0);

      if (isDirty) {
        e.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);
}
