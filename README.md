# Demo-Kit-Mapping-Tool

## Goal

Create an easy tool that maps out the insides of a Pelican 1510 case for consistent recreation of physical units.

While this use case is highly specific, the code base could be updated to cover a variety of situations.
For Example: Space planning of furniture within a house or apartment

### Additional Notes

Sizes must be hard-coded to ensure it meets exact measurements for physical accuracy.

## Current Progress

There is two total canvases.

 - Canvas One, the top canvas, is used to map component locations with the case.
 - Canvas Two, the bottom canvas, is used to map out the specific grid squares that are required to be cut out of the case.

## To Do

- [ ] The bottom canvas is able to create shapes on click but cannot immediately place them into the grid layout.  They must be moved into in order to snap to grid
- [x] Shape object declaration for multiple canvases can be simplified
- [x] Enable saving of bottom canvas, not just top
- [x] Additional CSS Styling
- [x] Cleaning of HTML and CSS
- [ ] \(Optional) Include a third canvas to map out bottom layer of internals.  Canvas One only includes the top layer of required components
