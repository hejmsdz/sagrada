import type { Color } from "@/game/types";
import patternB from "./patterns/b.svg?no-inline";
import patternG from "./patterns/g.svg?no-inline";
import patternP from "./patterns/p.svg?no-inline";
import patternR from "./patterns/r.svg?no-inline";
import patternY from "./patterns/y.svg?no-inline";

const PATTERNS: Record<Color, string> = {
  blue: patternB,
  green: patternG,
  purple: patternP,
  red: patternR,
  yellow: patternY,
};

export function Pattern({ color }: { color: Color }) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 opacity-15 bg-position-[5%_5%]"
      style={{
        backgroundImage: `url(${PATTERNS[color]})`,
      }}
    />
  );
}
