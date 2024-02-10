import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart';
import 'package:http_parser/http_parser.dart';
import 'package:provider/provider.dart';
import 'package:sagrada/ai.dart';
import 'package:sagrada/images.dart';
import 'package:sagrada/preferences.dart';
import 'package:sagrada/screens/placement_rules_check.dart';
import 'package:sagrada/screens/private_objective_selection.dart';
import 'package:sagrada/state.dart';
import 'package:sagrada/game.dart' as game;
import 'package:sagrada/widgets/board_view.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:image/image.dart' as image;

const confidenceThreshold = 0.94;

final emptyBoard = game.Board(
    List.generate(game.numRows, (index) => List.filled(game.numColumns, null)));

class PhotoReviewSheet extends StatefulWidget {
  final Future<String> imagePathFuture;

  const PhotoReviewSheet({super.key, required this.imagePathFuture});

  @override
  PhotoReviewSheetState createState() => PhotoReviewSheetState();
}

class PhotoReviewSheetState extends State<PhotoReviewSheet> {
  ImageRecognitionResult? result;
  game.Mask? mask;

  @override
  void initState() {
    super.initState();
    final state = Provider.of<AppState>(context, listen: false);

    state.setBoard(null, silent: true);

    () async {
      final imagePath = await widget.imagePathFuture;
      final boardImage = await image.decodeImageFile(imagePath);

      if (boardImage == null) {
        throw Exception("Failed to read the photo from file");
      }

      final grid = GridCoordinates(
        boardImage.width.toDouble(),
        boardImage.height.toDouble(),
      );

      final recognizer = await ImageRecognizer.create();
      final result = await recognizer.readBoard(boardImage, grid);

      setState(() {
        this.result = result;
        state.setBoard(result.board.copy());
      });

      if (!mounted) return;

      if (result.confidence < confidenceThreshold) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            duration: const Duration(milliseconds: 5000),
            behavior: SnackBarBehavior.floating,
            content: Text(AppLocalizations.of(context)!.lowConfidenceMessage),
          ),
        );
      }
    }();
  }

  void handleDiceTap(int i, int j, game.Dice? dice) {
    final state = Provider.of<AppState>(context, listen: false);
    final board = state.board;

    if (board == null) {
      return;
    }

    setState(() {
      mask = board.createMask((dice, loopI, loopJ) => i == loopI && j == loopJ);
    });

    () async {
      final editResult = await showDialog<DiceEditResult?>(
        context: context,
        builder: (BuildContext context) => DiceEditDialog(dice: dice),
      );

      setState(() {
        mask = null;
      });

      if (editResult == null) {
        return;
      }

      final newDice = editResult.dice;
      setState(() {
        board.set(i, j, newDice);
      });
    }();
  }

  Future<bool?> checkConsent() async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    bool? isConsentGiven = prefs.getBool(submitCorrectionsConsent);

    if (isConsentGiven == null) {
      isConsentGiven = await askForConsent();

      if (isConsentGiven != null) {
        await prefs.setBool(submitCorrectionsConsent, isConsentGiven);
      }
    }

    return isConsentGiven;
  }

  Future<bool?> askForConsent() {
    return showDialog<bool>(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            title: Text(AppLocalizations.of(context)!.shareCorrections),
            content:
                Text(AppLocalizations.of(context)!.shareCorrectionsMessage),
            actions: <Widget>[
              TextButton(
                style: TextButton.styleFrom(
                  textStyle: Theme.of(context).textTheme.labelLarge,
                ),
                child: Text(AppLocalizations.of(context)!.deny),
                onPressed: () {
                  Navigator.of(context).pop(false);
                },
              ),
              TextButton(
                style: TextButton.styleFrom(
                  textStyle: Theme.of(context).textTheme.labelLarge,
                ),
                child: Text(AppLocalizations.of(context)!.allow),
                onPressed: () {
                  Navigator.of(context).pop(true);
                },
              ),
            ],
          );
        });
  }

  bool hasAnyCorrections() {
    final state = Provider.of<AppState>(context, listen: false);
    bool hasCorrection = false;
    state.board!.forEachDice((dice, i, j) {
      if (dice != result!.board.at(i, j)) {
        hasCorrection = true;
      }
    });
    return hasCorrection;
  }

  void submitCorrections() {
    final state = Provider.of<AppState>(context, listen: false);

    if (state.board == null || result == null) {
      return;
    }

    state.board!.forEachDice((dice, i, j) {
      if (dice == result!.board.at(i, j)) {
        return;
      }

      final uri = Uri.parse("https://sagrada.mrozwadowski.com/corrections");
      final request = MultipartRequest("POST", uri);
      request.fields['color'] = dice?.color.name.substring(0, 1) ?? "x";
      request.fields['number'] = dice?.number.toString() ?? "0";
      final index = i * game.numColumns + j;
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
    return Padding(
      padding: const EdgeInsets.only(left: 18, right: 18, top: 10),
      child: Consumer<AppState>(builder: (context, state, child) {
        if (state.board == null) {}

        return Stack(
          children: [
            Visibility(
              visible: state.board == null,
              child: const Center(child: CircularProgressIndicator()),
            ),
            Visibility(
              visible: state.board != null,
              child: Column(children: [
                BoardView(
                  board: state.board ?? emptyBoard,
                  mask: mask,
                  onDiceTap: handleDiceTap,
                ),
                FilledButton.icon(
                  onPressed: () async {
                    if (state.board == null) {
                      return;
                    }

                    if (hasAnyCorrections()) {
                      final canSubmit = await checkConsent();
                      if (canSubmit == true) {
                        submitCorrections();
                      } else if (canSubmit == null) {
                        return;
                      }
                    }

                    if (!mounted) return;

                    final areAllRulesSatisfied = state.board!
                        .findIllegallyPlacedDice()
                        .every((row) => row.every((isIllegal) => !isIllegal));

                    Navigator.of(context).push(MaterialPageRoute(
                        builder: (context) => areAllRulesSatisfied
                            ? const PrivateObjectiveSelectionScreen()
                            : const PlacementRulesCheckScreen()));
                  },
                  icon: const Icon(Icons.check),
                  label: Text(AppLocalizations.of(context)!.confirm),
                ),
                Text(AppLocalizations.of(context)!.tapToCorrect,
                    style: Theme.of(context).textTheme.bodySmall),
              ]),
            )
          ],
        );
      }),
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
