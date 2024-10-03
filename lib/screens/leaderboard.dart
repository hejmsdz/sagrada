import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:sagrada/screens/public_objectives_selection.dart';
import 'package:sagrada/state.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class LeaderboardScreen extends StatelessWidget {
  const LeaderboardScreen({super.key});

  List<String> getPlayerNames(Map<String, int> leaderboard) {
    final playerNames = leaderboard.keys.toList();
    playerNames.sort((a, b) {
      final aScore = leaderboard[a] ?? 0;
      final bScore = leaderboard[b] ?? 0;

      return bScore - aScore;
    });

    return playerNames;
  }

  List<int> getStandings(
      List<String> playerNames, Map<String, int> leaderboard) {
    final standings = [1];
    for (int i = 1; i < playerNames.length; i++) {
      final score = leaderboard[playerNames[i]];
      final prevScore = leaderboard[playerNames[i - 1]];

      standings.add(prevScore == score ? standings[i - 1] : i + 1);
    }

    return standings;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(title: Text(AppLocalizations.of(context)!.leaderboard)),
        body: Consumer<AppState>(
          builder: (context, state, child) {
            final playerNames = getPlayerNames(state.leaderboard);
            final standings = getStandings(playerNames, state.leaderboard);

            return ListView.builder(
                itemCount: playerNames.length + 1,
                itemBuilder: (BuildContext context, int index) {
                  if (index == playerNames.length) {
                    return Padding(
                        padding: const EdgeInsets.all(16),
                        child: ElevatedButton(
                          onPressed: () async {
                            state.reset();
                            Navigator.of(context).pushAndRemoveUntil(
                                MaterialPageRoute(
                                    builder: (context) =>
                                        const PublicObjectivesSelectionScreen()),
                                (Route route) => false);
                          },
                          child: Text(AppLocalizations.of(context)!.newGame),
                        ));
                  }

                  final playerName = playerNames[index];
                  final score = state.leaderboard[playerName] ?? 0;

                  return ListTile(
                    title: Text(playerName),
                    leading: CircleAvatar(
                      child: Text("${standings[index]}"),
                    ),
                    trailing: Text('$score'),
                  );
                });
          },
        ));
  }
}
