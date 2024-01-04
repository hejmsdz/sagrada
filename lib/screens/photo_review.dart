import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:image/image.dart' as image;
import 'package:sagrada/ai.dart';
import 'package:sagrada/images.dart';
import 'package:sagrada/screens/private_goal_selection.dart';
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
  game.Mask? mask;
  Map<int, game.Dice?> corrections = {};

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
        boardImage.width.toDouble(),
        boardImage.height.toDouble(),
      );

      final recognizer = await ImageRecognizer.create();
      final result = await recognizer.readBoard(boardImage, grid);

      state.setBoard(result);
    }();
  }

  void handleDiceTap(int i, int j, game.Dice? dice) {
    final state = Provider.of<AppState>(context, listen: false);

    setState(() {
      mask = state.board!
          .createMask((dice, loopI, loopJ) => i == loopI && j == loopJ);
    });

    () async {
      final newDice = await showDialog<game.Dice?>(
        context: context,
        builder: (BuildContext context) => DiceEditDialog(dice: dice),
      );

      // BUG: when user dismisses the dialog, newDice is also null
      // and thus indistinguishable from setting a blank space

      state.setDice(i, j, newDice);

      if (newDice != dice) {
        final sequentialIndex = i * game.numColumns + j;
        corrections[sequentialIndex] = newDice;
      }

      setState(() {
        mask = null;
      });
    }();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Board scanning result')),
      body: Consumer<AppState>(builder: (context, state, child) {
        if (state.board == null) {
          return const Center(child: CircularProgressIndicator());
        }

        return Column(children: [
          AspectRatio(
              aspectRatio: 5 / 4,
              child: BoardView(
                board: state.board!,
                mask: mask,
                onDiceTap: handleDiceTap,
              )),
          const Card(
            child: Padding(
              padding: EdgeInsets.all(8.0),
              child: Text(
                  "Check the scanning results. If any dice was misidentified, tap it to correct the mistake manually."),
            ),
          ),
        ]);
      }),
      floatingActionButton: FloatingActionButton(
        onPressed: () async {
          // ScaffoldMessenger.of(context).showSnackBar(
          // SnackBar(content: Text("Corrections: ${corrections.length}")));

          await Navigator.of(context).push(MaterialPageRoute(
              builder: (context) => const PrivateGoalSelectionScreen()));
        },
        child: const Icon(Icons.check),
      ),
    );
  }
}

class DiceEditDialog extends StatefulWidget {
  final game.Dice? dice;

  const DiceEditDialog({super.key, required this.dice});

  @override
  DiceEditDialogState createState() => DiceEditDialogState();
}

class DiceEditDialogState extends State<DiceEditDialog> {
  game.Color? color;
  int number = 0;

  @override
  void initState() {
    super.initState();

    color = widget.dice?.color;
    number = widget.dice?.number ?? 0;
  }

  @override
  Widget build(BuildContext context) {
    final buttonStyle = ButtonStyle(
      backgroundColor:
          MaterialStateProperty.resolveWith<Color>((Set<MaterialState> states) {
        if (states.contains(MaterialState.selected)) {
          return (BoardView.diceColors[color] ?? Colors.grey).withAlpha(100);
        }
        return Colors.transparent;
      }),
    );

    return SimpleDialog(
      contentPadding: const EdgeInsets.fromLTRB(12.0, 12.0, 12.0, 0),
      children: [
        SegmentedButton<game.Color?>(
          showSelectedIcon: false,
          style: buttonStyle,
          segments: [...game.Color.values, null]
              .map((color) => ButtonSegment<game.Color?>(
                  value: color,
                  icon: color == null
                      ? const Icon(Icons.check_box_outline_blank)
                      : Icon(Icons.casino,
                          color: BoardView.diceColors[color]!)))
              .toList(),
          selected: {color},
          onSelectionChanged: (Set<game.Color?> newSelection) {
            setState(() {
              color = newSelection.first;
              if (color == null) {
                number = 0;
              }
            });
          },
        ),
        const SizedBox(height: 8),
        SegmentedButton<int>(
          showSelectedIcon: false,
          style: buttonStyle,
          segments: [1, 2, 3, 4, 5, 6]
              .map((number) => ButtonSegment<int>(
                    value: number,
                    label: Text('$number'),
                    enabled: color != null,
                  ))
              .toList(),
          selected: {number},
          onSelectionChanged: (Set<int> newSelection) {
            setState(() {
              number = newSelection.first;
            });
          },
        ),
        TextButton(
          style: TextButton.styleFrom(
            textStyle: Theme.of(context).textTheme.labelLarge,
          ),
          onPressed: color != null && number == 0
              ? null
              : () {
                  final newDice =
                      color == null ? null : game.Dice(color!, number);
                  Navigator.of(context).pop(newDice);
                },
          child: const Text('OK'),
        ),
      ],
    );
  }
}
