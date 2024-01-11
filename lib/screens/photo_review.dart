import 'package:flutter/material.dart';
import 'package:http/http.dart';
import 'package:http_parser/http_parser.dart';
import 'package:provider/provider.dart';
import 'package:image/image.dart' as image;
import 'package:sagrada/ai.dart';
import 'package:sagrada/images.dart';
import 'package:sagrada/screens/placement_rules_check.dart';
import 'package:sagrada/screens/private_goal_selection.dart';
import 'package:sagrada/state.dart';
import 'package:sagrada/game.dart' as game;
import 'package:sagrada/widgets/board_view.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class PhotoReviewScreen extends StatefulWidget {
  final String imagePath;

  const PhotoReviewScreen({super.key, required this.imagePath});

  @override
  PhotoReviewScreenState createState() => PhotoReviewScreenState();
}

class PhotoReviewScreenState extends State<PhotoReviewScreen> {
  ImageRecognitionResult? result;
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
      result = await recognizer.readBoard(boardImage, grid);

      state.setBoard(result!.board);
    }();
  }

  void handleDiceTap(int i, int j, game.Dice? dice) {
    final state = Provider.of<AppState>(context, listen: false);

    setState(() {
      mask = state.board!
          .createMask((dice, loopI, loopJ) => i == loopI && j == loopJ);
    });

    () async {
      final result = await showDialog<DiceEditResult?>(
        context: context,
        builder: (BuildContext context) => DiceEditDialog(dice: dice),
      );

      setState(() {
        mask = null;
      });

      if (result == null) {
        return;
      }

      final newDice = result.dice;

      state.setDice(i, j, newDice);

      if (newDice != dice) {
        final sequentialIndex = i * game.numColumns + j;
        corrections[sequentialIndex] = newDice;
      }
    }();
  }

  Future<void> submitCorrections() async {
    // TODO: ask for user's consent

    corrections.forEach((index, dice) {
      final uri = Uri.parse("https://sagrada.mrozwadowski.com/corrections");
      final request = MultipartRequest("POST", uri);
      request.fields['color'] = dice?.color.name.substring(0, 1) ?? "x";
      request.fields['number'] = dice?.number.toString() ?? "0";
      final pngData = image.encodePng(result!.diceCrops[index]);
      request.files.add(MultipartFile.fromBytes(
        'image',
        pngData,
        filename: 'dice.png',
        contentType: MediaType('image', 'png'),
      ));
      request.send();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
          title: Text(AppLocalizations.of(context)!.boardScanningResults)),
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
          Card(
            child: Padding(
              padding: const EdgeInsets.all(8.0),
              child: Text(AppLocalizations.of(context)!.scanReviewTip),
            ),
          ),
        ]);
      }),
      floatingActionButton: FloatingActionButton(
        onPressed: () async {
          submitCorrections();

          final state = Provider.of<AppState>(context, listen: false);
          final arePlacementRulesSatisfied = state.board!
              .findIllegallyPlacedDice()
              .every((row) => row.every((isInvalid) => !isInvalid));

          await Navigator.of(context).push(MaterialPageRoute(
              builder: (context) => arePlacementRulesSatisfied
                  ? const PrivateGoalSelectionScreen()
                  : const PlacementRulesCheckScreen()));
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

final class DiceEditResult {
  game.Dice? dice;

  DiceEditResult(this.dice);
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
                  Navigator.of(context).pop(DiceEditResult(newDice));
                },
          child: const Text('OK'),
        ),
      ],
    );
  }
}
