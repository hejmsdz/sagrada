import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:sagrada/scoring_rules.dart';
import 'package:sagrada/screens/photo_capture.dart';
import 'package:sagrada/state.dart';

final availableGoals = [
  LightShades(),
  MediumShades(),
  DeepShades(),
  ColorVariety(),
  ShadeVariety(),
  ColumnColorVariety(),
  ColumnShadeVariety(),
  RowColorVariety(),
  RowShadeVariety(),
  ColorDiagonals(),
];

class PublicGoalsSelectionScreen extends StatefulWidget {
  const PublicGoalsSelectionScreen({super.key});

  @override
  PublicGoalsSelectionScreenState createState() =>
      PublicGoalsSelectionScreenState();
}

class PublicGoalsSelectionScreenState
    extends State<PublicGoalsSelectionScreen> {
  Set<ScoringRule> goals = {};

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Select your public goals')),
      body: Padding(
          padding: const EdgeInsets.all(5.0),
          child: GridView.count(
            crossAxisCount: 2,
            childAspectRatio: 1.5,
            children: availableGoals
                .map((goal) => GoalCard(
                    goal: goal,
                    isSelected: goals.contains(goal),
                    onTap: () {
                      setState(() {
                        if (goals.contains(goal)) {
                          goals.remove(goal);
                        } else {
                          goals.add(goal);
                        }
                      });
                    }))
                .toList(),
          )),
      floatingActionButton: FloatingActionButton(
        onPressed: () async {
          if (goals.length != 3) {
            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
                content: Text("Select exactly 3 goals to continue.")));
            return;
          }

          final state = Provider.of<AppState>(context, listen: false);
          state.setPublicGoals(goals);
          await Navigator.of(context).push(MaterialPageRoute(
              builder: (context) => const PhotoCaptureScreen()));
        },
        child: const Icon(Icons.check),
      ),
    );
  }
}

class GoalCard extends StatelessWidget {
  final ScoringRule goal;
  final bool isSelected;
  final VoidCallback? onTap;

  const GoalCard(
      {super.key, required this.goal, this.isSelected = false, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      color: isSelected ? Theme.of(context).colorScheme.surfaceVariant : null,
      child: InkWell(
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.all(8.0),
            child:
                Column(mainAxisAlignment: MainAxisAlignment.center, children: [
              Text(
                goal.toString(),
                style: Theme.of(context).textTheme.bodyLarge,
                textAlign: TextAlign.center,
              ),
            ]),
          )),
    );
  }
}
