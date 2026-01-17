import type { Color } from "@/game/types";
import patternB from "./patterns/b.svg";
import patternG from "./patterns/g.svg";
import patternP from "./patterns/p.svg";
import patternR from "./patterns/r.svg";
import patternY from "./patterns/y.svg";

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
      className="absolute top-0 left-0 w-full h-full opacity-15 bg-position-[5%_5%]"
      style={{
        backgroundImage: `url(${PATTERNS[color]})`,
      }}
    />
  );
}
