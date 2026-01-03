import { useState } from "react";
import { ControlledInteractiveBoardView } from "./controlled-interactive-board-view";

const defaultSelectedCoordinates: [number, number] = [0, 0];

export function InteractiveBoardView({
  initialSelectedCoordinates = defaultSelectedCoordinates,
  ...props
}: Omit<
  React.ComponentProps<typeof ControlledInteractiveBoardView>,
  "selectedCoordinates" | "onNavigate"
> & {
  initialSelectedCoordinates: [number, number];
}) {
  const [selectedCoordinates, setSelectedCoordinates] = useState<
    [number, number]
  >(initialSelectedCoordinates);
  const onNavigate = (rowIndex: number, columnIndex: number) => {
    setSelectedCoordinates([rowIndex, columnIndex]);
  };

  return (
    <ControlledInteractiveBoardView
      {...props}
      selectedCoordinates={selectedCoordinates}
      onNavigate={onNavigate}
    />
  );
}
