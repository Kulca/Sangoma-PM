# Code Workflow

<!-- managed:linked-repos -->
## Linked Repositories
- Kulca/SNGM-
- Kulca/Sangoma-PM
<!-- /managed:linked-repos -->

## Default Process
1. Members push code to feature branches and create pull requests
2. The team lead reviews and merges PRs
3. Before starting new work, members should pull the latest default branch so they branch from up-to-date code

## Notes
- The team lead can update this file to reflect the owner's preferences (outside the managed block above, which is overwritten when the owner changes the allow-listed repositories)
- If the owner provides specific instructions about code review, branch strategy, or merge policies, update this document accordingly

## Asset Persistence & System Reliability
1. **Critical Artifacts**: Any non-code strategic document (CSV directories, architecture maps, regulatory packs) must be stored in `/home/team/shared` and committed to a designated `docs/` or `assets/` folder in the primary repository (`Sangoma-PM`).
2. **Weekly Snapshots**: The DevOps engineer is responsible for a weekly export of the task database and shared file structure to ensure no strategic data is lost in the event of sandbox reset.
3. **Recovery Drills**: Every new technical component must include a 'Recovery Section' in its documentation, explaining how to restore it from zero using only the repository and the shared directory.
