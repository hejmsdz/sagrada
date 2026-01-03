import { Popover, PopoverContent } from "@/components/ui/popover";
import { Board } from "@/game/types";
import { type OptionalDice } from "@/game/types";
import { useTranslation } from "react-i18next";
import { DiceEdit } from "./dice-edit";

export function DiceEditPopover({
  selectedCoordinates,
  onOpenChange,
  onNavigate,
  board,
  onChange,
  children,
}: {
  selectedCoordinates: [number, number] | null;
  onOpenChange: (open: boolean) => void;
  onNavigate: (rowIndex: number, columnIndex: number) => void;
  board: Board;
  onChange: (rowIndex: number, columnIndex: number, dice: OptionalDice) => void;
  children: React.ReactNode;
}) {
  const { t } = useTranslation();

  const [rowIndex, columnIndex] = selectedCoordinates ?? [-1, -1];

  return (
    <Popover open={selectedCoordinates !== null} onOpenChange={onOpenChange}>
      {children}
      <PopoverContent
        aria-label={t("editDice", {
          row: rowIndex + 1,
          column: columnIndex + 1,
        })}
      >
        {selectedCoordinates && (
          <DiceEdit
            dice={board.at(rowIndex, columnIndex)}
            onChange={(dice) => onChange(rowIndex, columnIndex, dice)}
            rowIndex={rowIndex}
            columnIndex={columnIndex}
            onNavigate={onNavigate}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
