# Lab Design Invariants

You must always follow the strict invariants when writing lab code for Grade 3.

## MULTI-AGENT DRIFT PREVENTION (CRITICAL)
1. **NO HTML UI OVER 3D:** The invariant is "Diegetic UI". NEVER overlay generic HTML `<button>` or `<div className="absolute">` panels on top of a 3D canvas unless it is the LabShell itself. If a student needs to click something in a 3D lab, they click a 3D mesh (a chunky button, lever, block, or terminal).
2. **NO MONOLITHIC FILES:** Do not stuff a 2000-line 3D scene into a single `page.tsx`. Break out distinct components.
3. **NO SCRIPT-BASED DEVELOPMENT:** Do NOT write python or JS scripts to regex-replace code. Use native file editing tools.

## Core Rules:
1. **NO EMOJIS ANYWHERE**: Use Lucide icons, bespoke animated SVGs, or CSS geometry.
2. **NO BLAND DEVELOPER DASHBOARDS**: Use bright, saturated, tactile physical environments with personality.
3. **CAUSE-AND-EFFECT MUST BE IMMEDIATE**: Changes happen instantly and dramatically in the same part of the screen.
4. **NO FAKE AI DELAYS**: Do not add fake setTimeout spinners.
5. **DO NOT DESIGN THE UI FIRST**: Start with the physical game world. Layout follows from the world's natural shape.
6. **PRESERVE ESTABLISHED INTEGRATION CONTRACTS**: Never alter LabShell contracts, useLMSBridge, useLabAudio, or Celebration overlays.
7. **ZERO JARGON**: Use age-appropriate Grade 3 English.
8. **PHYSICAL MANIPULATION**: Drag, flip, slide, crank, or touch objects — not click text buttons that produce text result badges.
9. **ZERO CLIPPING**: Perfect containment at 1024x450 and 700x600 is an absolute requirement.
10. **ADVANCED 3D (R3F) ENGINEERING PROTOCOLS**:
    - **Render-Fighting (The Jitter Rule):** NEVER mutate a physics variable inside `useFrame` on the exact same `<group>` that is receiving a React state prop like `position={[x, y, z]}`. React will overwrite the physics 60 times a second, causing violent jitter. ALWAYS use nested groups: Outer Group for React `[X, 0, Z]` state, Inner Group for `useFrame` `Y-axis` physics.
    - **The 60FPS State Killer:** NEVER call React state setters inside a `useFrame` loop. Handle logic gracefully in pointer events or use pure native refs for interpolation.
    - **Bulletproof Z-Fighting Fix:** ALWAYS use native WebGL `polygonOffset={true} polygonOffsetFactor={-1} polygonOffsetUnits={-1}` on materials for decals/posters/papers.
    - **Camera Constraints:** For Grade 3 students, fully free `OrbitControls` are disorienting. Disable pan entirely (`enablePan={false}`). Tightly restrict zoom (`minDistance`, `maxDistance`) and rotation angles (`minPolarAngle`, `maxPolarAngle`) so the scene always remains in full view.
    - **Pointer Capture:** Fast dragging can cause the cursor to slip off the 3D mesh. Use pointer capture: `e.target.setPointerCapture(e.pointerId)`.
    - **OrbitControls Drag-Lock:** Mutate the ref synchronously: `orbitRef.current.enabled = false`.
11. **NEVER TOUCH LABSHELL UI:** LabShell is permanent and handles the navigation entirely.
12. **ABSOLUTE CONTAINER FOR R3F ZERO-CLIPPING**: When putting a `<Canvas>` inside the LabShell, you MUST wrap it in `<div className="absolute inset-0">` to guarantee zero clipping.

