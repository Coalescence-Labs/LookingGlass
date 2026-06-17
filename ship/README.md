# Ship runs

End-to-end article pipeline logs from [`ship-article`](../.cursor/skills/ship-article/SKILL.md).

One folder per article slug; each run adds a dated log:

```
ship/<slug>/
  run-YYYY-MM-DD.md    # phases completed, commits, PR URL, Linear issue
```

The maintainer merges the PR manually; after merge, update the run log and
Linear issue to done.
