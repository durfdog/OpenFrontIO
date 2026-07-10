# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/

# workflow
- When exploring an unfamiliar codebase, check git history (recent commits) and CLAUDE.md before using broad grep searches. Confidence: 0.65

# game-design
- When modifying troop values, multiply the desired number by 10 in code (e.g., use 50_000 for 5,000 troops). Confidence: 0.85

# build-preview
- Do not show a placement range ring for City units in BuildPreviewController. Confidence: 0.70

# exploration
- Use subagents (code-navigator) to explore unfamiliar codebases before making changes. Confidence: 0.80

# game-design
- Do not invent or recommend gameplay effects/values for tech tree nodes; wait for the user to define the effects and implement exactly what they specify. Confidence: 0.85

# localization
- Each tech tree node's nameKey (title) should describe its gameplay effect (e.g., "+5k gold per node"), not a thematic name (e.g., "Development"). Confidence: 0.85

