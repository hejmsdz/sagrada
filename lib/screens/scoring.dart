import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:sagrada/scoring_rules.dart';
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

  @override
  void initState() {
    super.initState();

    final state = Provider.of<AppState>(context, listen: false);

    setState(() {
      rules = [
        BlankPenalty(),
        SumColor(state.privateGoalColor!),
        ...state.publicGoals
      ];
      results = rules.map((rule) => rule.getScore(state.board!)).toList();
      total = results.map((result) => result.score).reduce((a, b) => a + b);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(AppLocalizations.of(context)!.scoring)),
      body: Consumer<AppState>(builder: (context, state, child) {
        final mask =
            selectedRuleIndex >= 0 ? results[selectedRuleIndex].mask : null;

        return Column(children: [
          AspectRatio(
              aspectRatio: 5 / 4,
              child: BoardView(
                board: state.board!,
                mask: mask,
              )),
          Expanded(
              child: ListView.builder(
                  itemCount: rules.length + 2,
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

                    return TotalListTile(total: total + tokensCount);
                  })),
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
