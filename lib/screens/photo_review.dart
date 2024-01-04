import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:image/image.dart' as image;
import 'package:sagrada/ai.dart';
import 'package:sagrada/images.dart';
import 'package:sagrada/state.dart';
import 'package:sagrada/game.dart' as game;
import 'package:sagrada/widgets/board_view.dart';

class PhotoReviewScreen extends StatefulWidget {
  final String imagePath;

  const PhotoReviewScreen({super.key, required this.imagePath});

  @override
  PhotoReviewScreenState createState() => PhotoReviewScreenState();
}

class PhotoReviewScreenState extends State<PhotoReviewScreen> {
  List<List<bool>>? mask;
  // int scoringRuleIndex = -1;

  @override
  void initState() {
    super.initState();

    final state = Provider.of<AppState>(context, listen: false);
    state.resetBoard();

    () async {
      final boardImage = await image.decodeImageFile(widget.imagePath);
      if (boardImage == null) {
        return;
      }

      final grid = GridCoordinates(
          boardImage.width.toDouble(), boardImage.height.toDouble());

      final recognizer = await ImageRecognizer.create();
      final result = await recognizer.readBoard(boardImage, grid);
      state.setBoard(result);
    }();
  }

  void handleDiceTap(int i, int j) async {
    setState(() {
      mask = List.generate(
          game.numRows, (i) => List.filled(game.numColumns, false));
      mask![i][j] = true;
    });

    await showDialog(
        context: context,
        builder: (BuildContext context) {
          return Consumer<AppState>(builder: (context, state, child) {
            final dice = state.board?.board[i][j];
            final isBlank = dice == null;

            return SimpleDialog(
              contentPadding: const EdgeInsets.all(12.0),
              children: [
                SegmentedButton<int>(
                  showSelectedIcon: false,
                  segments: [1, 2, 3, 4, 5, 6]
                      .map((number) => ButtonSegment<int>(
                            value: number,
                            label: Text('$number'),
                          ))
                      .toList(),
                  selected: {isBlank ? 0 : dice.number},
                  onSelectionChanged: (Set<int> newSelection) {
                    state.setDiceNumber(i, j, newSelection.first);
                  },
                ),
                const SizedBox(height: 8),
                SegmentedButton<game.Color?>(
                  showSelectedIcon: false,
                  segments: [...game.Color.values, null]
                      .map((color) => ButtonSegment<game.Color?>(
                          value: color,
                          icon: color == null
                              ? const Icon(Icons.check_box_outline_blank)
                              : Icon(Icons.casino,
                                  color: BoardView.diceColors[color]!)))
                      .toList(),
                  selected: {dice?.color},
                  onSelectionChanged: (Set<game.Color?> newSelection) {
                    if (newSelection.first == null) {
                      state.removeDice(i, j);
                    } else {
                      state.setDiceColor(i, j, newSelection.first!);
                    }
                  },
                ),
              ],
            );
          });
        });
    setState(() {
      mask = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(title: const Text('Board scanning result')),
        body: Consumer<AppState>(builder: (context, state, child) {
          if (state.board == null) {
            return const Center(child: CircularProgressIndicator());
          }

          /*
          final scoringRules = state.getScoringRules();
          final results =
              scoringRules.map((rule) => rule.getScore(state.board!)).toList();

          final total =
              results.map((result) => result.score).reduce((a, b) => a + b);
          */

          return Column(children: [
            AspectRatio(
                aspectRatio: 5 / 4,
                child: BoardView(
                  board: state.board!,
                  mask: mask,
                  onDiceTap: handleDiceTap,
                )),
            /*
            Expanded(
                child: ListView.builder(
                    itemCount: scoringRules.length + 1,
                    itemBuilder: (BuildContext context, int index) {
                      if (index == scoringRules.length) {
                        const bold = TextStyle(fontWeight: FontWeight.bold);
                        return ListTile(
                          title: const Text("Total", style: bold),
                          trailing: Text('$total', style: bold),
                        );
                      }

                      final rule = scoringRules[index];
                      final result = results[index];

                      return ListTile(
                        title: Text(rule.toString()),
                        trailing: Text('${result.score}'),
                        subtitle: Text(result.calculation),
                        selected: index == scoringRuleIndex,
                        onTap: () => {
                          setState(() {
                            if (index == scoringRuleIndex) {
                              scoringRuleIndex = -1;
                              mask = null;
                            } else {
                              mask = result.mask;
                              scoringRuleIndex = index;
                            }
                          })
                        },
                      );
                    })),
                */
          ]);
        }));
  }
}
