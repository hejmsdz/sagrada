import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:sagrada/screens/private_objective_selection.dart';
import 'package:sagrada/state.dart';
import 'package:sagrada/game.dart' as game;
import 'package:sagrada/widgets/board_view.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class PlacementRulesCheckScreen extends StatefulWidget {
  const PlacementRulesCheckScreen({super.key});

  @override
  PlacementRulesCheckScreenState createState() =>
      PlacementRulesCheckScreenState();
}

class PlacementRulesCheckScreenState extends State<PlacementRulesCheckScreen> {
  late game.Board originalBoard;
  late game.Board board;
  late game.Mask mask;

  @override
  void initState() {
    super.initState();

    final state = Provider.of<AppState>(context, listen: false);
    originalBoard = state.board!;
    board = state.board!.copy();
    mask = board.findIllegallyPlacedDice();
  }

  void handleDiceTap(int i, int j, game.Dice? dice) {
    if (!mask[i][j]) {
      final originalDice = originalBoard.at(i, j);
      if (dice == null && originalDice != null) {
        setState(() {
          board.set(i, j, originalDice);
          mask = board.findIllegallyPlacedDice();
        });
      }

      return;
    }

    setState(() {
      board.set(i, j, null);
      mask = board.findIllegallyPlacedDice();
    });
  }

  @override
  Widget build(BuildContext context) {
    final isValid = mask.every((row) => row.every((isInvalid) => !isInvalid));

    return Scaffold(
      appBar: AppBar(
          title: Text(AppLocalizations.of(context)!.placementRulesCheck)),
      body: Column(children: [
        BoardView(
          board: board,
          mask: isValid ? null : mask,
          onDiceTap: handleDiceTap,
        ),
        Card(
          child: Padding(
            padding: const EdgeInsets.all(8.0),
            child: isValid
                ? Text(AppLocalizations.of(context)!.placementRulesSatisfied)
                : Text(AppLocalizations.of(context)!.placementRulesCheckTip),
          ),
        ),
      ]),
      floatingActionButton: isValid
          ? FloatingActionButton(
              onPressed: () async {
                final state = Provider.of<AppState>(context, listen: false);
                state.setBoard(board);

                await Navigator.of(context).push(MaterialPageRoute(
                    builder: (context) =>
                        const PrivateObjectiveSelectionScreen()));
              },
              child: const Icon(Icons.check),
            )
          : null,
    );
  }
}
