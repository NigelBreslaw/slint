# Component Gallery

Preview styled controls built on the public headless components imported from `@controls`.
The compiler bundles these controls; no library-path configuration is needed.
The controls API is experimental and may change.

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
Each styled wrapper uses the state, focus, keyboard interaction, and accessibility behavior from Slint Controls.

## Adapt a Design

Edit `components/button.slint` to apply the supplied design's colors, typography, spacing, and shapes.
Keep interaction behavior in the headless component.
Add controls in `gallery.slint` for any additional properties the design needs.

## Create a Custom Button

Import a headless control from `@controls` and add visuals that read its public state.
The control supplies input, focus, and accessibility behavior.

```slint
import { Button } from "@controls";

export component MyButton inherits Button {
    min-width: 120px;
    min-height: 40px;
    border-radius: 8px;
    background: !root.enabled ? #666
        : root.pressed ? #234a99
        : root.has-hover ? #467de0 : #3267c8;
    border-width: root.has-focus ? 2px : 0px;
    border-color: #aac8ff;

    Text {
        text: root.text;
        color: white;
        horizontal-alignment: center;
        vertical-alignment: center;
        accessible-role: none;
    }
}
```
