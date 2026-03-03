# homeRoughEditor Version 0.95 (SN0WM4N)

## Read-Only Mode

For this task, I approached the solution with the goal of keeping the existing methods publicly accessible while preventing their execution in invalid contexts. To achieve this, I implemented a blocking mechanism by defining non-writable properties on the window object.

#### Important Observation

During the initial floor plan selection phase, it is still possible to invoke editor functions directly from the browser DevTools. However, once a floor plan is selected, any modifications performed through this method are reverted automatically.

#### Potential Improvement

A more robust solution would be to enforce the read-only restriction at all times and only temporarily unlock the methods during the initialization phase of a new floor plan. Once the initialization process is complete, the system should immediately restore the locked state.

This approach would ensure stricter control over unintended external manipulation while preserving the intended public API structure.

## Wall-Only Item

I implemented a new Window > Glass element as a wall-only item.
This component can be dragged and attached exclusively to walls, following the wall constraints defined in the system. It can also be removed through its corresponding contextual menu.

## Free Item

I added a new Misc > Toilet element as a free item.
Unlike wall-constrained elements, this object can move freely across the floor plan. It also includes full support for deletion via its contextual menu.

#### Leak

Collisions are only working for xy-axis rectangles, so should be included a stronger collide system like Near Grid Collision System (NGCS) + Separating Axis Theorem (SAT).

## Additional Improvements & Personal Contributions

#### Implemented keyboard shortcuts:

Ctrl + Z for Undo

Ctrl + Y for Redo

DELETE for delete selected items

These were added to improve usability and align the editor with standard user experience expectations.

#### Issues 

Fixed a UI bug where adjusting size values using arrow keys inside the settings menu would also move the entire canvas. This unintended behavior has been corrected.

Added Escape key support to exit edition mode, improving workflow efficiency and overall usability.


## Events available

* 'history:init'
* 'history:undo'
* 'history:redo'
* 'floorplan:save'
* 'wall:delete'
* 'wall:update:move'
* 'wall:update:width'
* 'object:delete'
* 'object:update:move'
* 'object:update:width'
* 'object:update:height'
* 'object:update:rotate'
* 'object:inWall:setPivot'
* 'room:applySurface'
* 'room:tools:reset'
* 'room:update:color'
* 'show:rib'
* 'show:area'
* 'show:layerRoom'
* 'show:layerEnergy'
* 'mode:select'
* 'mode:line'
* 'mode:partition'
* 'mode:rect'
* 'mode:door'
* 'mode:window'
* 'mode:object'
* 'mode:misc'
* 'mode:room'
* 'mode:distance'
* 'mode:node'
* 'mode:text'
* 'mode:grid'
* 'zoom:in'
* 'zoom:out'
* 'zoom:zoomin'
* 'zoom:zoomout'
* 'zoom:zoomreset'
* 'zoom:zoomleft'
* 'zoom:zoomright'
* 'zoom:zoomtop'
* 'zoom:zoombottom'
* 'text:color'