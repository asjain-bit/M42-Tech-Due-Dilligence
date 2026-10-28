# Design System Architecture & Component Inventory

## 1. Design Principles
- **Tokens-only Styling**: No raw hex, rgb, or hsl values exist outside of `primitives.css`. Components reference custom CSS variable tokens directly or via Tailwind utility classes mapped to tokens.
- **Bottom-Up Composition**: Components strictly follow Atomic Design principles (Brad Frost, Chapter 2). Atoms compose zero atomic children. Molecules compose two or more atoms. Organisms compose molecules and atoms for self-contained business sections. Templates define structural slots.
- **Single Responsibility Per File**: Every component layer maintains a co-located layout: `ComponentName.tsx`, `ComponentName.types.ts`, `ComponentName.test.tsx`, `ComponentName.stories.tsx`, and `index.ts`.
- **Co-located Testing**: Every component carries a full Vitest + Testing Library test suite ensuring 90%+ code coverage across lines, functions, branches, and statements.
- **AI-Elements Opt-In**: Experimental AI components are partitioned under `src/components/ai-elements/` and excluded from linting and code coverage gates.

---

## 2. Design Token System
The token architecture is organized into a strict three-phase CSS cascade imported sequentially inside `src/app/globals.css`:

```
+-------------------------------------------------------------+
| @import "tailwindcss";                                      |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
| 1. primitives.css (:root raw color ramps, radius, spacing) |
|    Header: "DO NOT EDIT. Update by re-converting..."        |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
| 2. light.css & dark.css (:root, [data-theme="light|dark"]) |
|    Semantic role bindings (Backgrounds, Text, Borders...)   |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
| 3. brand.css (White-label & feature branch overrides)       |
|    Starts with explanation & includes A11y contrast fix     |
+-------------------------------------------------------------+
```

### Semantic Role Groups

| Group | Property Range | Example Custom Property |
| :--- | :--- | :--- |
| **Backgrounds** | `--bg-default`, `--bg-surface-1..5`, `--bg-overlay`, `--bg-input`, `--bg-tooltip`, `--bg-modal`, `--bg-sidebar`, `--bg-hover`, `--bg-pressed`, `--bg-selected`, `--bg-disabled` | `var(--bg-surface-1)` |
| **Text** | `--text-primary`, `--text-secondary`, `--text-tertiary`, `--text-disabled`, `--text-placeholder`, `--text-inverse`, `--text-on-primary`, `--text-accent`, `--text-link`, `--text-success`, `--text-warning`, `--text-error`, `--text-info` | `var(--text-primary)` |
| **Borders** | `--border-default`, `--border-subtle`, `--border-strong`, `--border-focus` | `var(--border-default)` |
| **Actions** | `--action-primary-bg-default`, `--action-primary-bg-hover`, `--action-primary-bg-pressed`, `--action-primary-text`, `--action-primary-bg-soft`, `--action-destructive-bg-default`, `--action-destructive-bg-hover`, `--action-destructive-text` | `var(--action-primary-bg-default)` |
| **Status** | `--status-success-bg/text/border/icon`, `--status-warning-bg/text/border/icon`, `--status-error-bg/text/border/icon`, `--status-info-bg/text/border/icon` | `var(--status-success-bg)` |

---

## 3. Layout

The application skeleton is governed by the `AppShell` template component matching the exact pixel layout grid below:

```
┌──────────────────────────────────────────────────────────┐
│ topbar  (56px)                                            │
├───────────┬───────────────────────────────┬───────────────┤
│ leftbar   │ main (flex-grow)              │ rightbar      │
│ (165px /  │                                │ (~280px,      │
│ 48px      │                                │ hide/show)    │
│ collapsed)│                                │               │
└───────────┴───────────────────────────────┴───────────────┘
```

### Slot Props
- `topbar`: Header slot pinned at top (56px height). Accepts `SiteHeader` organism.
- `leftbar`: Navigation sidebar slot with support for collapsed mode (165px expanded / 48px collapsed).
- `main`: Primary flexible viewport content container (`flex-grow`).
- `rightbar`: Contextual slide-out/desktop details drawer slot (~280px width, toggleable).

---

## 4. Component Inventory

### Atoms
*Single DOM elements with zero component children.*

| Name | Path | Description | Used in |
| :--- | :--- | :--- | :--- |
| **Button** | `src/components/atoms/Button` | Standard button with variants (primary, secondary, destructive, ghost, outline). | FormField, SearchBar, Toast, AppDialog, SiteHeader, DataTable, SettingsPanel |
| **Input** | `src/components/atoms/Input` | Single-line text input with token borders and error states. | FormField, SearchBar, SettingsPanel, DataTable |
| **Textarea** | `src/components/atoms/Textarea` | Multi-line text input component. | FormField, SettingsPanel |
| **Select** | `src/components/atoms/Select` | Native HTML drop-down select element. | FormField, DataTable, SettingsPanel |
| **Badge** | `src/components/atoms/Badge` | Status tag indicator badge. | KPICard, Toast, DataTable |
| **Spinner** | `src/components/atoms/Spinner` | Animated loading status indicator. | Button, DataTable, KPICard |
| **Avatar** | `src/components/atoms/Avatar` | User image profile avatar with fallback initials. | SiteHeader, SettingsPanel, DataTable |
| **ThemeToggle** | `src/components/atoms/ThemeToggle` | Interactive button cycling light -> dark -> system theme choices. | SiteHeader, SettingsPanel |
| **Icon** | `src/components/atoms/Icon` | SVG icon renderer for standard icon set. | SearchBar, ThemeToggle, Toast, SiteHeader, KPICard |

### Molecules
*Two or more atoms combined for a single focused purpose.*

| Name | Path | Description | Used in |
| :--- | :--- | :--- | :--- |
| **FormField** | `src/components/molecules/FormField` | Label + Input atom + helper text / error message. | SettingsPanel, AppDialog |
| **SearchBar** | `src/components/molecules/SearchBar` | Input atom + Icon atom + Search Button atom. | SiteHeader, DataTable |
| **FilterMenu** | `src/components/molecules/FilterMenu` | Filter button with active count that opens a popover of Select atom dropdowns. | DashboardScreen, VendorsScreen |
| **Toast** | `src/components/molecules/Toast` | Alert notification card with Icon, message, and close Button. | SettingsPanel, AppShell |
| **AppDialog** | `src/components/molecules/AppDialog` | Modal dialog backdrop + window with action Buttons. | SettingsPanel, DataTable |
| **KPICard** | `src/components/molecules/KPICard` | Metric display card with title, value, Badge, and trend Icon. | SettingsPanel, AppShell, page.tsx |

### Organisms
*Distinct self-contained business sections composing molecules and atoms.*

| Name | Path | Description | Used in |
| :--- | :--- | :--- | :--- |
| **SiteHeader** | `src/components/organisms/SiteHeader` | Application header bar with brand logo, SearchBar, nav links, and ThemeToggle. | AppShell, page.tsx |
| **DataTable** | `src/components/organisms/DataTable` | Column-driven, sortable, paginated data table with filter control. | SettingsPanel, AppShell, page.tsx |
| **SettingsPanel** | `src/components/organisms/SettingsPanel` | Account settings view with FormField, Avatar, ThemeToggle, Toast, and AppDialog. | page.tsx |

### Templates
*Layout structural skeletons accepting content slots.*

| Name | Path | Description | Used in |
| :--- | :--- | :--- | :--- |
| **AppShell** | `src/components/templates/AppShell` | Grid layout skeleton providing topbar, leftbar, main, and rightbar slots. | app/page.tsx |
