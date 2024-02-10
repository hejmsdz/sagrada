import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:sagrada/scoring_rules.dart';
import 'package:sagrada/screens/photo_capture.dart';
import 'package:sagrada/state.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

final availableObjectives = [
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

class PublicObjectivesSelectionScreen extends StatefulWidget {
  const PublicObjectivesSelectionScreen({super.key});

  @override
  PublicObjectivesSelectionScreenState createState() =>
      PublicObjectivesSelectionScreenState();
}

class PublicObjectivesSelectionScreenState
    extends State<PublicObjectivesSelectionScreen> {
  Set<ScoringRule> objectives = {};

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
          title: Text(
        AppLocalizations.of(context)!.selectPublicObjectives,
      )),
      body: Padding(
          padding: const EdgeInsets.all(5.0),
          child: GridView.count(
            crossAxisCount: 2,
            childAspectRatio: 0.8,
            padding: const EdgeInsets.only(bottom: 50),
            children: availableObjectives
                .map((objective) => ObjectiveCard(
                    objective: objective,
                    isSelected: objectives.contains(objective),
                    onTap: () {
                      setState(() {
                        if (objectives.contains(objective)) {
                          objectives.remove(objective);
                        } else {
                          objectives.add(objective);
                        }
                      });
                    }))
                .toList(),
          )),
      floatingActionButton: FloatingActionButton(
        onPressed: () async {
          if (objectives.length != 3) {
            ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                content: Text(
                    AppLocalizations.of(context)!.objectivesSelectionMessage)));
            return;
          }

          final state = Provider.of<AppState>(context, listen: false);
          state.setPublicObjectives(objectives);
          await Navigator.of(context).push(MaterialPageRoute(
              settings: const RouteSettings(name: "/photoCapture"),
              builder: (context) => const PhotoCaptureScreen()));
        },
        child: const Icon(Icons.check),
      ),
    );
  }
}

class ObjectiveCard extends StatelessWidget {
  final ScoringRule objective;
  final bool isSelected;
  final VoidCallback? onTap;

  const ObjectiveCard(
      {super.key,
      required this.objective,
      this.isSelected = false,
      this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      color: isSelected ? Theme.of(context).colorScheme.surfaceVariant : null,
      elevation: isSelected ? 5 : 1,
      child: InkWell(
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Image.asset(
                    'assets/images/public_objectives/${objective.runtimeType.toString()}.png'),
                const Padding(padding: EdgeInsets.only(top: 12)),
                Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      isSelected
                          ? const Icon(Icons.check)
                          : const SizedBox.shrink(),
                      Flexible(
                        child: Text(
                          objective
                              .getTranslation(AppLocalizations.of(context)!),
                          style: Theme.of(context)
                              .textTheme
                              .bodyLarge!
                              .copyWith(
                                  fontWeight:
                                      isSelected ? FontWeight.bold : null),
                          softWrap: true,
                          textAlign: TextAlign.center,
                        ),
                      ),
                    ])
              ],
            ),
          )),
    );
  }
}
