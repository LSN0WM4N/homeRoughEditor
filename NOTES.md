# homeRoughEditor v0.95 (SN0WM4N)

## Web Component

The editor is now exposed through a custom Web Component called `<editor-element>`.  
This component encapsulates the editor logic and allows it to be embedded directly into any HTML page while keeping the internal implementation isolated.

### Usage

```html
<editor-element 
  mode="edition"
  sketch-id="2459bd870c0c5182"
  sketch-version="1.0"
></editor-element>
```

-   `mode`: 
    -   `edition`: Enables full editor functionality (create, move, resize, delete).

    -   `readonly`: Loads the editor in read-only mode, preventing any modification to the floor
-   `sketch-id`
-   `sketch-version`

### Cons

This implementation is currently not fully complete.
Some internal parts of the editor still rely on global references and legacy behaviors from the original architecture.

For a more detailed explanation of the remaining limitations and the proposed solutions, please refer to the Future Improvements section.

## Read-Only Mode

To support a read-only environment, I implemented a runtime protection mechanism that prevents editor operations from executing while still keeping the original public methods accessible.

The approach relies on defining immutable flags on the global scope
(`window`) using `Object.defineProperty`.

``` javascript
Object.defineProperty(window, '__READONLY_MODE__', {
  value: true,
  configurable: false,
  writable: false,
  enumerable: false
});
```

All mutating editor operations validate these flags before execution.

### Rationale

This approach allows:

-   Maintaining the existing public API
-   Avoiding invasive refactoring
-   Preventing state mutation during read-only sessions

Example guard used in editor methods:

``` javascript
if (window.__READONLY_MODE__ && window.__READONLY_MOUNTED__) {
  console.warn("[editor] Operation blocked by readonly method");
  return;
}
```

### Security Observation

During the initial floor plan selection phase, it is still technically possible to invoke editor methods manually via browser DevTools.

However, once a floor plan is mounted, any external mutations are automatically reverted by the editor lifecycle, preventing persistent modification.

### Potential Improvement

A more robust design would enforce the read-only restriction globally at all times, only unlocking the editor methods during the floor plan initialization phase.

Once initialization is completed, the editor would immediately restore the locked state.

This approach would:

-   Eliminate temporary mutation windows
-   Provide stronger protection against external manipulation
-   Preserve the same public API surface

## Wall-Only Item

### Overlap Restriction

An overlap constraint was implemented for wall-only elements. The minimum allowed distance between two wall-only items is 0.2m (20 cm).

This prevents invalid placements and ensures consistent spatial layout along walls.

### New Element: Window > Glass

A new Window > Glass component was implemented as a wall-only element.

Characteristics:

-   Can only attach to walls
-   Constrained movement along wall segments
-   Supports removal via the contextual menu
-   Fully integrated into the existing editor object system


### Enumeration System

A new enumeration mechanism was introduced for wall-attached elements.

When selecting a wall-only object, the settings panel now provides a "Set as Start Element" option.

Once activated:

-   The selected object becomes the pivot element
-   All wall-only elements are enumerated counter-clockwise (CCW) starting from that element

Properties of the system:

-   Enumeration updates in real time
-   Works across moves, insertions, and deletions
-   Indexes are displayed only while editing a wall-only element

This improves orientation and element management when working with multiple wall objects.

## Free Item

### New Element: Misc > Toilet

A new Misc > Toilet element was implemented as a free item.

Unlike wall-constrained elements, free items:

-   Can move freely across the floor plan
-   Are not bound to walls
-   Support full deletion through the contextual menu

### Collision System

To prevent overlapping between objects, a pairwise collision detection system was implemented.

The algorithm:

1.  Detects collisions between axis-aligned bounding boxes (AABB)
2.  When a collision occurs during movement, the system searches for the closest valid position
3.  The optimal non-colliding position is found using binary search

This produces smoother and more natural object movement near obstacles.

### Known Limitation

The current collision system only supports axis-aligned rectangles.

For more robust collision handling, a future improvement would involve implementing:

-   Near Grid Collision System (NGCS)
-   Separating Axis Theorem (SAT)

This would enable accurate collision detection for rotated objects and
more complex shapes.

## Additional Improvements

### Static Image Optimization

All `.jpg` asset images were replaced with `.webp` equivalents.

This change reduced the total asset size from 37.4 KB to 2.4 KB, representing a ~15x reduction in file size while maintaining visual quality. This optimization improves loading performance and reduces bandwidth usage.

### Keyboard Shortcuts

To improve usability and align with common editor standards, several keyboard shortcuts were implemented:

| Shortcut | Action                 | 
|----------|------------------------|
| Ctrl + Z | Undo                   |
| Ctrl + Y | Redo                   |
| Delete   | Delete selected object |

These shortcuts integrate with the existing history system.

### Bug Fix

A UI bug was fixed where modifying numeric values in the settings panel using arrow keys would unintentionally move the entire canvas.

The input handling logic was updated to correctly isolate the control behavior.


### Escape Key Support

Pressing Escape now exits the current editing mode.

This improves workflow efficiency and provides a quick way to cancel editing operations.

## Event System

The editor exposes a set of events that can be listened to externally.

### History

-   `history:init`
-   `history:undo`
-   `history:redo`

### Floor Plan

-   `floorplan:save`

### Walls

-   `wall:delete`
-   `wall:update:move`
-   `wall:update:width`

### Objects

-   `object:delete`
-   `object:update:move`
-   `object:update:width`
-   `object:update:height`
-   `object:update:rotate`
-   `object:inWall:setPivot`

### Rooms

-   `room:applySurface`
-   `room:tools:reset`
-   `room:update:color`

### Visualization

-   `show:rib`
-   `show:area`
-   `show:layerRoom`
-   `show:layerEnergy`

### Modes

-   `mode:select`
-   `mode:line`
-   `mode:partition`
-   `mode:rect`
-   `mode:door`
-   `mode:window`
-   `mode:object`
-   `mode:misc`
-   `mode:room`
-   `mode:distance`
-   `mode:node`
-   `mode:text`
-   `mode:grid`

### Zoom Controls

-   `zoom:in`
-   `zoom:out`
-   `zoom:zoomin`
-   `zoom:zoomout`
-   `zoom:zoomreset`
-   `zoom:zoomleft`
-   `zoom:zoomright`
-   `zoom:zoomtop`
-   `zoom:zoombottom`

### Text

-   `text:color`


## Future Improvements

During the development process, I found the current codebase difficult to navigate and extend due to several architectural characteristics.

The project relies heavily on global scope usage, including frequent references to `window` and `document`, global event listeners, and global `querySelector` calls. Many of these references are only relevant within the editor context, yet they are exposed globally. This makes the system harder to reason about and increases the risk of side effects when introducing new features.

Additionally, the codebase contains:

- Large files with multiple responsibilities
- Tight coupling between UI, engine logic, and utility functions
- Limited separation between rendering logic and editor behavior
- Implicit dependencies through shared global state

Because of this structure, adding new features or modifying existing ones becomes progressively more complex. Changes in one area may unintentionally affect unrelated parts of the system (A problem that I frequently encountered).

### Proposed Architectural Direction

Given more time, my preferred approach would be a progressive architectural refactor focused on stronger separation of concerns.

The main goals of such refactor would include:

- Encapsulation of editor logic
  - Move editor functionality into a dedicated scoped container (e.g. the `editor-element` Web Component).

- Reduction of global dependencies
  - Replace direct `window` / `document` access with scoped selectors or injected dependencies.

- Separation of responsibilities
  - Rendering layer responsible only for drawing.
  - Engine layer responsible for geometric calculations and constraints.
  - UI layer responsible for interaction and user controls.

- Modularization
  - Break down large files into smaller modules with clearly defined responsibilities.

This approach would make the codebase easier to understand, reduce coupling between subsystems, and significantly improve maintainability.

### Long-Term Refactor Strategy

A full architectural reconstruction would likely introduce short-term disruption but would provide significant long-term benefits:

- Improved maintainability
- Reduced bug surface
- Faster feature development
- Clearer boundaries between subsystems

In large interactive editors such as this one, these improvements often translate directly into better developer productivity and system reliability.

### Potential TypeScript Adoption

Another improvement worth considering is the adoption of TypeScript.

TypeScript would provide:

- Static type checking
- Better IDE tooling and autocomplete
- Earlier detection of potential runtime errors
- Clearer data structures and API contracts

Since TypeScript transpiles to standard JavaScript, this change would not significantly impact browser compatibility or bundle size while providing substantial development benefits.