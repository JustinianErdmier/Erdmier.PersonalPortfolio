# Blazor WASM Rework — Design Spec

- **Date:** 2026-06-16
- **Project:** JustinianErdmier.github.io
- **Status:** Approved

## Goals

Rework the portfolio site as a Blazor WASM application. Two equal motivations:

1. **Showcase** — the portfolio itself becomes a live demonstration of Blazor SME skill
2. **Developer experience** — maintain in C# and Razor rather than vanilla JS/HTML

The Windows 11 desktop aesthetic is preserved exactly. No visual redesign.

---

## Section 1: Architecture & Project Structure

**Tech stack:** Blazor WASM standalone, .NET 10, no UI component library, no backend.

**Project name:** `JustinianErdmier.Portfolio`

```
JustinianErdmier.Portfolio/
├── Components/
│   ├── Layout/
│   │   └── MainLayout.razor + .razor.css
│   ├── Shell/
│   │   ├── TitleBar.razor + .razor.css
│   │   ├── NavigationRail.razor + .razor.css
│   │   ├── Taskbar.razor + .razor.css
│   │   ├── StartMenu.razor + .razor.css
│   │   ├── DetailModal.razor + .razor.css
│   │   └── Toast.razor + .razor.css
│   ├── Sections/
│   │   ├── About.razor
│   │   ├── Skills.razor
│   │   ├── Experience.razor
│   │   ├── Education.razor
│   │   ├── Projects.razor
│   │   └── Contact.razor
│   └── Shared/
│       ├── Card.razor + .razor.css
│       ├── SectionHeader.razor + .razor.css
│       ├── ChipList.razor
│       ├── StatItem.razor
│       ├── SkillRow.razor + .razor.css
│       ├── ProjectCard.razor + .razor.css
│       ├── TimelineItem.razor + .razor.css
│       ├── EducationItem.razor + .razor.css
│       ├── CertificationItem.razor + .razor.css
│       └── ContactMethod.razor + .razor.css
├── Models/
│   ├── ExperienceEntry.cs
│   ├── ProjectEntry.cs
│   └── (supporting record types)
├── Services/
│   ├── ThemeService.cs
│   ├── ModalService.cs
│   ├── ToastService.cs
│   └── WindowStateService.cs
├── Common/
│   └── PortfolioContent.cs
├── wwwroot/
│   ├── css/app.css
│   ├── js/interop.js
│   ├── images/
│   └── documents/
├── App.razor
├── GlobalUsings.cs
├── Program.cs
└── _Imports.razor
```

---

## Section 2: Component Breakdown

### Shell Components

**`MainLayout`** — composes the entire desktop shell. Renders: wallpaper, `.win` (with `TitleBar` + `NavigationRail` + `@Body`), `StartMenu`, `Taskbar`, `DetailModal`, `Toast`.
Binds `.minimized`/`.maximized` CSS classes on `.win` from `WindowStateService`. Owns start menu open/close as local `bool` state.

**`TitleBar`** — caption buttons (minimize/maximize/close). Injects `WindowStateService` and `ToastService`. The close button triggers a toast ("A portfolio is never really
closed…") rather than closing.

**`NavigationRail`** — nav buttons + theme toggle. Injects `NavigationManager` (to highlight active route) and `ThemeService`. Active item derived from `NavigationManager.Uri`,
updated via `LocationChanged`.

**`Taskbar`** — start button, app button (restore/minimize toggle), résumé/GitHub/LinkedIn/email links, live clock. Clock runs via a C# `PeriodicTimer` — no JS needed. Injects
`WindowStateService` and `NavigationManager`.

**`StartMenu`** — jump-to grid and user footer. Parameters: `bool IsOpen`, `EventCallback OnClose`. Injects `NavigationManager` for tile clicks.

**`DetailModal`** — subscribes to `ModalService.OnChange`. Accepts a `RenderFragment` for body content (replaces the current string-based `renderExp`/`renderProj` approach). Focus
trap handled via `IJSRuntime`. Closes on overlay click, close button, or Escape key.

**`Toast`** — subscribes to `ToastService.OnChange`. Auto-dismisses after 5.2 s via `Task.Delay`.

### Boot Screen

The boot screen is **not a Razor component**. It lives entirely in `index.html` as a static overlay, visible immediately before any JS or WASM loads. `blazor.webassembly.js` uses
`autostart="false"`; a script calls `Blazor.start().then(() => endBoot())` where `endBoot()` is defined in `interop.js`. This ensures the boot overlay covers both the WASM download
phase and the Blazor initialization phase seamlessly.

### Section Pages

`About`, `Skills`, `Experience`, `Education`, `Projects`, `Contact` — `@page` components, pure content. `Experience` and `Projects` inject `ModalService` to open the modal with a
`RenderFragment` for the entry detail view.

### Shared Components

| Component           | Parameters                                                            | Used in                                  |
|---------------------|-----------------------------------------------------------------------|------------------------------------------|
| `SectionHeader`     | `string Title`, `string Subtitle`                                     | All 6 sections                           |
| `Card`              | `RenderFragment Title`, `RenderFragment ChildContent`                 | Skills, Education                        |
| `ChipList`          | `IEnumerable<string> Items`                                           | Skills, Experience modal, Projects modal |
| `StatItem`          | `string Number`, `string Label`                                       | About                                    |
| `SkillRow`          | `string Name`, `string Years`, `string Tier`                          | Skills                                   |
| `ProjectCard`       | `ProjectEntry Entry`, `EventCallback OnClick`                         | Projects                                 |
| `TimelineItem`      | `ExperienceEntry Entry`, `bool IsLeft`, `EventCallback OnViewDetails` | Experience                               |
| `EducationItem`     | `string Title`, `string Subtitle`, `string Description`               | Education                                |
| `CertificationItem` | `string Title`, `string Subtitle`, `RenderFragment Actions`           | Education                                |
| `ContactMethod`     | `string Label`, `string Value`, `string Href`, `RenderFragment Icon`  | Contact                                  |

---

## Section 3: Services

All four services registered as singletons in `Program.cs`.

**`ThemeService`** — manages dark/light theme state. On initialization, reads the saved preference from `localStorage` via `IJSRuntime`, falling back to `prefers-color-scheme`.
`ApplyTheme(ThemeMode mode)` sets `data-theme` on `<body>` and writes to `localStorage` via JS interop. Exposes `event Action OnChange`. `ThemeMode` is `enum { Light, Dark }`.

**`ModalService`** — manages modal visibility and content. Exposes `Open(string title, string subtitle, RenderFragment content)` and `Close()`. `DetailModal` subscribes to
`event Action OnChange` and reads `Title`, `Subtitle`, `Content`, and `IsOpen`. No JS interop needed.

**`ToastService`** — manages toast visibility and message. Exposes `Show(MarkupString message)` (accepts `MarkupString` so the close-button toast can include an anchor tag). Sets
message, raises `OnChange`, fires `Task.Delay(5200)` then auto-dismisses.

**`WindowStateService`** — manages minimize/maximize state. Exposes `Minimize()`, `Restore()`, `ToggleMaximize()`, and `WindowState` (`enum { Normal, Minimized, Maximized }`).
`MainLayout` binds CSS classes; `TitleBar` calls the methods; `Taskbar` app button calls `Minimize`/`Restore`.

---

## Section 4: Content Model

All model types are C# `record` types in `Models/`.

### `ExperienceEntry`

```csharp
record ExperienceEntry(
    string[] Skills,
    TechnologyGroup[] Technologies,
    IReadOnlyList<IDescriptionItem> Description
)

interface IDescriptionItem { }
record PlainDescriptionItem(string Text) : IDescriptionItem
record NestedDescriptionItem(string Text, string[] SubItems) : IDescriptionItem

record TechnologyGroup(string Name, string[] Items)
```

`TechnologyGroup` with no sub-items passes `[]` for `Items`. Rendering checks `Items.Length`, not null.

### `ProjectEntry`

```csharp
record ProjectEntry(
    string Tagline,
    string[] Overview,
    string[] Highlights,
    string[] Technologies,
    string RepositoryUrl,
    string? ImagePath = null,
    string? ImageAlt = null,
    string? AspectRatio = null
)
```

The `DomainCore` project's code snippet is a special case rendered as a `RenderFragment` directly in `Projects.razor`, not stored in the model.

### `PortfolioContent`

```csharp
static class PortfolioContent
{
    public static class ExperienceKeys
    {
        public const string OneMain   = "OneMain";
        public const string Toyota    = "Toyota";
        public const string Lieberman = "Lieberman";
    }

    public static class ProjectKeys
    {
        public const string Zoo        = "Zoo";
        public const string DomainCore = "DomainCore";
        public const string Reliquary  = "Reliquary";
    }

    public static readonly IReadOnlyDictionary<string, ExperienceEntry> Experience = ...;
    public static readonly IReadOnlyDictionary<string, ProjectEntry> Projects = ...;
}
```

---

## Section 5: CSS Strategy

### `wwwroot/css/app.css` (global)

- CSS custom properties (`:root` and `[data-theme="dark"]` — `--accent`, `--text-1`, `--text-2`, background tokens, etc.)
- `body`, `html`, `*` resets and base rules
- `.wallpaper` background
- Utility classes used across multiple components (`.chip`, `.btn`, `.gi`, etc.)
- Boot screen styles (boot screen lives in `index.html`, not a component)
- Toast and modal overlay backdrop

### Per-component `.razor.css` (scoped)

Each Shell component and each Section page gets its own scoped stylesheet for styles that belong exclusively to it. `ChipList` and `StatItem` have no component-specific styles and
need no `.razor.css`.

Where styles target child content rendered via `@Body` or `RenderFragment` (e.g. modal body content from `Experience`/`Projects`), use `::deep` to pierce the CSS isolation scope
boundary.

The existing `site.css` is the source of truth for all values — no styles are invented, only reorganised.

---

## Section 6: JavaScript Interop

The goal is to minimise JS to only what Blazor genuinely cannot do.

### Pre-first-paint (inline in `index.html` `<head>`)

Two inline scripts remain inline — not extracted to an external file — to guarantee deterministic execution before any CSS renders, eliminating theme and boot flash on cold-cache
first loads:

- **Theme application** — reads `localStorage['je-theme']` and `prefers-color-scheme`, sets `data-theme` on `<body>`
- **Boot-skip** — reads `sessionStorage['je-booted']`; hides the boot overlay immediately if already booted

### Boot sequence

- `blazor.webassembly.js` uses `autostart="false"`
- An inline script calls `Blazor.start().then(() => endBoot())`
- `endBoot()` is defined in `interop.js` — plays the fade animation then hides the overlay

### `wwwroot/js/interop.js`

| Function                | Purpose                                        |
|-------------------------|------------------------------------------------|
| `getTheme()`            | Read `localStorage['je-theme']`                |
| `setTheme(mode)`        | Write `localStorage['je-theme']`               |
| `setBodyTheme(mode)`    | Set `data-theme` attribute on `<body>`         |
| `getIsBooted()`         | Read `sessionStorage['je-booted']`             |
| `setBooted()`           | Write `sessionStorage['je-booted']`            |
| `endBoot()`             | Trigger boot overlay fade and removal          |
| `trapFocus(element)`    | Activate focus trap for `DetailModal`          |
| `releaseFocus(element)` | Release focus trap                             |
| `restoreFocus(element)` | Return focus to trigger element on modal close |

Both storage access functions wrap calls in `try/catch` and fail gracefully (private browsing mode).

### No JS required for

- Live clock → C# `PeriodicTimer` in `Taskbar`
- System preference listener → `ThemeService` reads on init via `IJSRuntime` once, then owns state
- Modal open/close state → `ModalService`
- Window min/max state → `WindowStateService`
- Start menu open/close → local `bool` in `MainLayout`
- Toast auto-dismiss → `Task.Delay` in `ToastService`

---

## Section 7: Routing

Each section is a `@page` component. The URL updates naturally; `MainLayout` persists across all navigation so the shell never re-renders.

| Route         | Component          |
|---------------|--------------------|
| `/`           | `About.razor`      |
| `/skills`     | `Skills.razor`     |
| `/experience` | `Experience.razor` |
| `/education`  | `Education.razor`  |
| `/projects`   | `Projects.razor`   |
| `/contact`    | `Contact.razor`    |

**`App.razor`** — standard Blazor router with `MainLayout` as default layout. `NotFound` redirects to `/`.

**Active nav item** — `NavigationRail` injects `NavigationManager` and derives the active item from `NavigationManager.Uri` via `LocationChanged`.

**Programmatic navigation** — `StartMenu` tiles, the hero "View projects" button, and About CTAs call `NavigationManager.NavigateTo(route)`. The `data-go` attribute pattern from
the current JS is replaced by `@onclick` handlers.

### Hosting decision gate (open)

Client-side routing requires the host to serve `index.html` for all routes. Two options remain under consideration:

- **GitHub Pages** — requires the `404.html` redirect hack; free, familiar domain (`justinianerdmier.github.io`)
- **Azure Static Web Apps** — handles routing natively via `staticwebapp.config.json`; free tier available; domain situation requires research

This decision is deferred pending research into Azure Static Web Apps free tier and custom domain support.

---

## Section 8: Error Handling & Testing

### Error handling

The only meaningful failure surface is JS interop — `localStorage` and `sessionStorage` are unavailable in some private browsing modes. Both the inline boot-skip script and
`ThemeService` wrap storage access in `try/catch` and fall back gracefully:

- Theme: defaults to `prefers-color-scheme`
- Boot sequence: defaults to showing the boot animation

No other async failure paths exist — content is hardcoded, there are no HTTP calls, and static assets fail silently in the browser.

### Testing

No test project is warranted. Correctness is verified through manual testing:

- **Theme** — persists across page reloads, follows system preference when unset, toggles correctly
- **Boot sequence** — plays on first load, skips on reload within the same session
- **Window chrome** — minimize animates toward taskbar, taskbar button restores, maximize fills viewport
- **Modal** — opens with correct content for each experience/project entry, focus trap works, closes on overlay click and Escape
- **Routing** — all six routes resolve, nav rail highlights correct item, deep links work, `NotFound` redirects to `/`
- **Start menu** — opens/closes, tile navigation works, closes on outside click and Escape
- **Toast** — appears on close-button click, auto-dismisses after 5.2 s, link is clickable
