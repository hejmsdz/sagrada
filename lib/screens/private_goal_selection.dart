import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:sagrada/scoring_rules.dart';
import 'package:sagrada/screens/scoring.dart';
import 'package:sagrada/state.dart';
import 'package:sagrada/game.dart' as game;
import 'package:sagrada/widgets/board_view.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class PrivateGoalSelectionScreen extends StatefulWidget {
  const PrivateGoalSelectionScreen({super.key});

  @override
  PrivateGoalSelectionScreenState createState() =>
      PrivateGoalSelectionScreenState();
}

class PrivateGoalSelectionScreenState
    extends State<PrivateGoalSelectionScreen> {
  Set<ScoringRule> goals = {};

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
          title: Text(AppLocalizations.of(context)!.boardScanningResults)),
      body: ListView.builder(
          itemCount: game.Color.values.length,
          itemBuilder: (BuildContext context, int index) {
            final color = game.Color.values[index];

            return ListTile(
              title: Text(color.getTranslation(AppLocalizations.of(context)!)),
              tileColor: BoardView.diceColors[color],
              onTap: () async {
                final state = Provider.of<AppState>(context, listen: false);
                state.setPrivateGoalColor(color);

                await Navigator.of(context).push(MaterialPageRoute(
                    builder: (context) => const ScoringScreen()));
              },
            );
          }),
    );
  }
}
