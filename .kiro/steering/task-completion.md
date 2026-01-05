---
inclusion: always
---

# Task Completion Guidelines

## Post-Task Actions

After completing any task from the implementation plan:

1. **Verify Implementation**: Ensure all code changes are working correctly
2. **Run Tests**: Execute relevant tests to confirm functionality
3. **Build Check**: Verify the project builds successfully
4. **Commit Changes**: Always commit the completed work with a descriptive message

## Commit Message Format

Use conventional commit format when committing task completion:

```
feat(task-X.Y): implement [component/feature name]

- Brief description of what was implemented
- Reference to requirements satisfied
- Any notable technical decisions

Validates: Requirements X.Y, X.Z
```

## Example Commit Messages

```
feat(task-3.1): implement PriceInput component

- Created input component with red border styling
- Added numeric validation and error handling  
- Supports empty values, negatives, and decimals
- Comprehensive test suite with 10 test cases

Validates: Requirements 2.1, 3.1, 4.1, 7.1, 7.3, 7.4
```

This ensures a clear history of implementation progress and makes it easy to track which requirements have been satisfied.