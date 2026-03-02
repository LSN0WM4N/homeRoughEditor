# homeRoughEditor Version 0.95 (SN0WM4N)

## Read-Only Mode

For this task, I approached the solution with the goal of keeping the existing methods publicly accessible while preventing their execution in invalid contexts. To achieve this, I implemented a blocking mechanism by defining non-writable properties on the window object.

#### Important Observation

During the initial floor plan selection phase, it is still possible to invoke editor functions directly from the browser DevTools. However, once a floor plan is selected, any modifications performed through this method are reverted automatically.

#### Potential Improvement

A more robust solution would be to enforce the read-only restriction at all times and only temporarily unlock the methods during the initialization phase of a new floor plan. Once the initialization process is complete, the system should immediately restore the locked state.

This approach would ensure stricter control over unintended external manipulation while preserving the intended public API structure.