class GridCoordinates {
  late double margin;
  late double left;
  late double width;
  late double right;
  late double cellSize;
  late double height;
  late double top;
  late double bottom;

  GridCoordinates(double containerWidth, double containerHeight) {
    margin = 0.05 * containerWidth;
    left = margin;
    width = containerWidth - 2 * margin;
    right = left + width;
    cellSize = width / 5;
    height = cellSize * 4;
    top = (containerHeight - height) / 2;
    bottom = top + height;
  }
}
