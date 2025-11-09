# AGENTS.md

## Project Overview

This repository contains a front-end only to-do list application built with Expo + React Native. The app must run entirely on-device with no backend services or network APIs. Focus on fast startup, smooth interactions, and consistent behavior across iOS, Android, and web (Expo Router).

## Core Requirements

- **Offline-first**: All task data lives in memory during a session and should be persisted locally (AsyncStorage or SQLite if required by new features).
- **Zero network calls**: Do not add REST/GraphQL clients or external API dependencies.
- **Lightweight UX**: Prioritize responsive layouts that adapt to small phone screens first; scale up gracefully to tablets and web.
- **Deterministic state**: Ensure predictable state transitions so that closing and reopening the app restores the previous task list.

## Architecture & State Management

- Use modern React function components, hooks, and React Compiler optimizations.
- Store task state in a dedicated provider (React Context or Zustand/MobX-State-Tree if justified). Keep state colocated and typed with interfaces such as `Task` (id, title, description optional, status, timestamps).
- Abstract persistence behind a storage module (e.g., `storage/tasksStorage.ts`) that exposes async CRUD helpers using `AsyncStorage`.
- Implement optimistic updates where possible and reconcile with persisted storage on boot via hydration hooks.
- Add memoization (`useMemo`, `useCallback`) around expensive selectors or render-heavy lists.

## Feature Expectations

- Task lifecycle: create, edit, toggle completion, delete, and optional reordering.
- Filtering and grouping (e.g., active vs completed) should be handled locally with derived selectors.
- Support search or tag features only if they keep storage schema simple; update the `Task` model accordingly.
- Provide empty states, loading skeletons for hydration, and confirmation prompts for destructive actions.

## UI & UX Guidelines

- Build screens using Expo Router with a primary list screen and modal/details screens for editing.
- Use `FlatList` or `FlashList` (if added) for scalable task rendering.
- Favor accessible components: adequate hit targets, dynamic type support, high-contrast themes, and proper `testID`s for MCP automation.
- Keep styling inside `styles.ts` or colocated StyleSheet objects; prefer design tokens/variables for colors, spacing, typography.

## Persistence & Data Format

- Persist only serializable JSON via `AsyncStorage`. If schema changes, implement versioned migrations in the storage module.
- When hydrating, guard against corrupted data and fall back to sane defaults.
- Keep IDs stable (e.g., `nanoid` or UUID). Avoid using index-based keys in lists.

## Documentation Resources

Always review the official Expo documentation before implementing features:

- https://docs.expo.dev/llms.txt
- https://docs.expo.dev/llms-full.txt
- https://docs.expo.dev/llms-eas.txt
- https://docs.expo.dev/llms-sdk.txt
- https://reactnative.dev/docs/getting-started

## Essential Commands

```bash
npx expo start                  # Start dev server
npx expo start --clear          # Clear cache and restart
npx expo install <package>      # Install Expo-compatible packages
npx expo install --check        # Verify package versions
npx expo install --fix          # Fix incompatible versions
npx expo doctor                 # Diagnose project issues
npm run lint                    # Run ESLint (ensure script exists)
```

## Testing & Quality Assurance

- Add `testID` props to critical components for MCP automation.
- Use React Native DevTools (`mcp_expo-mcp_open_devtools`) for performance and state inspection.
- Remove debug `console.log` before production; use `console.warn`/`console.error` thoughtfully.
- Plan for unit tests around storage helpers and state reducers when testing framework is introduced.

## Troubleshooting

- If Expo Go fails after native module changes, create a development build (`eas build:dev`).
- After installing new packages, restart Metro with `npx expo start --clear`.
- Check AsyncStorage limits and handle quota errors gracefully.

## Working Agreement for Agents

1. Read relevant sections of the Expo docs before coding.
2. Follow existing folder structure and naming conventions; keep new modules typed and documented as needed.
3. Coordinate changes to storage schema and state shape in PR descriptions to avoid data loss.
4. Optimize for maintainability: keep components small, reuse hooks, and document complex logic inline with short comments.
