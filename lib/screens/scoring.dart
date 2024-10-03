import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:sagrada/scoring_rules.dart';
import 'package:sagrada/screens/leaderboard.dart';
import 'package:sagrada/state.dart';
import 'package:sagrada/widgets/board_view.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class ScoringScreen extends StatefulWidget {
  const ScoringScreen({super.key});

  @override
  ScoringScreenState createState() => ScoringScreenState();
}

class ScoringScreenState extends State<ScoringScreen> {
  int selectedRuleIndex = -1;
  List<ScoringRule> rules = [];
  List<ScoringResult> results = [];
  int tokensCount = 0;
  int total = 0;
  String? playerName;

  @override
  void initState() {
    super.initState();

    final state = Provider.of<AppState>(context, listen: false);

    setState(() {
      rules = [
        BlankPenalty(),
        SumColor(state.privateObjectiveColor!),
        ...state.publicObjectives
      ];
      results = rules.map((rule) => rule.getScore(state.board!)).toList();
      total = results.map((result) => result.score).reduce((a, b) => a + b);
    });
  }

  Future<bool> _showPlayerNameDialog() async {
    final controller = TextEditingController();

    String? name = playerName ??
        await showDialog<String?>(
          context: context,
          barrierDismissible: true,
          builder: (BuildContext context) {
            return AlertDialog(
              title: Text(AppLocalizations.of(context)!.whoseScoreWasThat),
              content: SingleChildScrollView(
                child: ListBody(
                  children: <Widget>[
                    Text(AppLocalizations.of(context)!.enterPlayerName),
                    Padding(
                      padding: const EdgeInsets.only(top: 16),
                      child: TextField(
                        controller: controller,
                        autofocus: true,
                        textCapitalization: TextCapitalization.words,
                        decoration: InputDecoration(
                          border: const OutlineInputBorder(),
                          labelText: AppLocalizations.of(context)!.playerName,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              actions: <Widget>[
                TextButton(
                  child: Text(AppLocalizations.of(context)!.ok),
                  onPressed: () {
                    Navigator.of(context).pop(controller.text);
                  },
                ),
              ],
            );
          },
        );

    if (name == null) {
      return false;
    }

    if (name != "" && mounted) {
      playerName = name;
      final state = Provider.of<AppState>(context, listen: false);
      state.saveScore(name, total);
    }

    return true;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(AppLocalizations.of(context)!.scoring)),
      body: Consumer<AppState>(builder: (context, state, child) {
        final mask =
            selectedRuleIndex >= 0 ? results[selectedRuleIndex].mask : null;

        if (state.board == null) {
          return Container();
        }

        return Column(children: [
          BoardView(
            board: state.board!,
            mask: mask,
          ),
          Expanded(
            child: ListView.builder(
                itemCount: rules.length + 3,
                itemBuilder: (BuildContext context, int index) {
                  if (index < rules.length) {
                    return RuleListTile(
                      rule: rules[index],
                      result: results[index],
                      isSelected: index == selectedRuleIndex,
                      onTap: () {
                        setState(() {
                          selectedRuleIndex =
                              selectedRuleIndex == index ? -1 : index;
                        });
                      },
                    );
                  }

                  if (index == rules.length) {
                    return TokensListTile(
                      count: tokensCount,
                      onIncrement: () {
                        setState(() {
                          tokensCount++;
                        });
                      },
                      onDecrement: () {
                        setState(() {
                          tokensCount--;
                        });
                      },
                    );
                  }

                  if (index == rules.length + 1) {
                    return TotalListTile(total: total + tokensCount);
                  }

                  return Flex(
                    direction: Axis.vertical,
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      ElevatedButton(
                        onPressed: () async {
                          if (!await _showPlayerNameDialog()) {
                            return;
                          }

                          Navigator.of(context)
                              .popUntil(ModalRoute.withName("/photoCapture"));
                        },
                        child: Text(
                            AppLocalizations.of(context)!.checkAnotherBoard),
                      ),
                      state.leaderboard.isEmpty
                          ? Container()
                          : ElevatedButton(
                              onPressed: () async {
                                if (!await _showPlayerNameDialog()) {
                                  return;
                                }

                                Navigator.of(context).push(MaterialPageRoute(
                                    builder: (context) =>
                                        const LeaderboardScreen()));
                              },
                              child: Text(
                                  AppLocalizations.of(context)!.leaderboard),
                            )
                    ],
                  );
                }),
          ),
        ]);
      }),
    );
  }
}

class RuleListTile extends StatelessWidget {
  final ScoringRule rule;
  final ScoringResult result;
  final bool isSelected;
  final VoidCallback? onTap;

  const RuleListTile(
      {super.key,
      required this.rule,
      required this.result,
      this.isSelected = false,
      this.onTap});

  @override
  Widget build(BuildContext context) {
    return ListTile(
      title: Text(rule.getTranslation(AppLocalizations.of(context)!)),
      trailing: Text('${result.score}'),
      subtitle: Text(result.calculation),
      selected: isSelected,
      onTap: onTap,
    );
  }
}

class TokensListTile extends StatelessWidget {
  final int count;
  final VoidCallback onIncrement;
  final VoidCallback onDecrement;

  const TokensListTile({
    super.key,
    required this.count,
    required this.onIncrement,
    required this.onDecrement,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      title: Row(children: [
        Text(AppLocalizations.of(context)!.favorTokensLeft),
        IconButton(
          onPressed: count < 6 ? onIncrement : null,
          icon: const Icon(Icons.add),
        ),
        IconButton(
          onPressed: count > 0 ? onDecrement : null,
          icon: const Icon(Icons.remove),
        )
      ]),
      trailing: Text('$count'),
    );
  }
}

class TotalListTile extends StatelessWidget {
  final int total;

  const TotalListTile({super.key, required this.total});

  @override
  Widget build(BuildContext context) {
    const bold = TextStyle(fontWeight: FontWeight.bold, fontSize: 16.0);

    return ListTile(
      title: Text(AppLocalizations.of(context)!.total, style: bold),
      trailing: Text('$total', style: bold),
    );
  }
}
