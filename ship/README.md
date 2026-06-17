# Ship runs

End-to-end article pipeline logs from [`ship-article`](../.cursor/skills/ship-article/SKILL.md).

Each pipeline phase is **committed and pushed** to `plan/<slug>` before the
next phase starts. The run log records commit SHAs and push confirmation per
phase.

One folder per article slug; each run adds a dated log:

```
ship/<slug>/
  run-YYYY-MM-DD.md    # phases completed, commits, PR URL, Linear issue
```

The maintainer merges the PR manually; after merge, update the run log and
Linear issue to done.
