# Component Gallery Prototype

Preview styled controls built on the public headless components in `ui-libraries/base-ui`.
The starter skin is illustrative; it isn't derived from a Figma design.

## Run

From the repository root:

```sh
cargo run --bin slint-viewer -- --auto-reload examples/component-gallery/gallery.slint
```

The viewer runs the gallery as a desktop window and reloads changes to its Slint files.
This prototype doesn't need a separate Rust application.

## Try the Button

Change the label, variant, size, disabled state, and corner radius in the properties panel.
Click the preview to increment its counter.
Use Tab to focus the preview, then Space or Enter to activate it.
The status row displays the button's hover, pressed, and focus states.
Disabled buttons shouldn't increment the counter.
Use **Reset preview** to restore the sample values and clear the counter.

## Try the Slider

Drag the slider handle or focus it and use the arrow, Home, and End keys.
The styled wrapper owns the track and handle visuals, while the headless component owns interaction and accessibility.

## Try the Selection Controls

Toggle the checkbox and switch, then select a density with the radio group.
Each styled wrapper uses the state, focus, keyboard interaction, and accessibility behavior from Base UI.

## Adapt a Design

Edit `components/button.slint` to apply the supplied design's colors, typography, spacing, and shapes.
Keep interaction behavior in the headless component.
Add controls in `gallery.slint` for any additional properties the design needs.

## Next Steps

- Supply a Figma button design and replace the starter skin with its appearance and states.
- Capture that workflow in a reusable AI skill.
- Add automated UI checks for activation, keyboard input, and disabled behavior.
- Extend component discovery and editor integration after validating the button workflow.

Figma access, an AI skill, a component manifest, MCP integration, and automated UI tests aren't implemented in this prototype.
