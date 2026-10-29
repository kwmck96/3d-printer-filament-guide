// Generic setting names used in this app, with what the major slicers call them.
// `unintuitive: true` → the setting gets an asterisk and a footnote, because at
// least one popular slicer uses a name (or location) you wouldn't guess.
//
// Names reflect PrusaSlicer 2.x, OrcaSlicer 2.x (Bambu Studio is closely
// related) and UltiMaker Cura 5.x. Labels move between releases; treat these as
// search terms for your slicer's settings panel.

export const glossary = {
  zoffset: {
    name: 'Z offset',
    unintuitive: true,
    prusa: '"Z offset" (Printer settings) or Live Adjust Z on the printer',
    orca: '"Z offset" (Printer settings)',
    cura: 'No built-in setting; adjust on the printer (babystepping) or with a plugin',
  },
  volumetric: {
    name: 'Max volumetric speed',
    unintuitive: true,
    prusa: '"Max volumetric speed" (Filament settings → Advanced)',
    orca: '"Max volumetric speed" (Filament settings)',
    cura: 'No direct equivalent; lower print speeds instead',
  },
  flow: {
    name: 'Flow rate',
    unintuitive: true,
    prusa: '"Extrusion multiplier" (Filament settings)',
    orca: '"Flow ratio" (Filament settings)',
    cura: '"Flow" (Material)',
  },
  efc: {
    name: 'Elephant-foot compensation',
    unintuitive: true,
    prusa: '"Elephant foot compensation"',
    orca: '"Elephant foot compensation"',
    cura: '"Initial Layer Horizontal Expansion", set to a negative value',
  },
  wipe: {
    name: 'Wipe on retraction / avoid crossing walls',
    unintuitive: true,
    prusa: '"Wipe while retracting"; "Avoid crossing perimeters"',
    orca: '"Wipe while retracting"; "Avoid crossing walls"',
    cura: 'No exact wipe equivalent ("Coasting" is the nearest); "Combing Mode" avoids crossing walls',
  },
  zhop: {
    name: 'Z hop',
    unintuitive: true,
    prusa: '"Lift height" (Printer settings → Extruder → Travel lift; called "Lift Z" before 2.7)',
    orca: '"Z hop"',
    cura: '"Z Hop When Retracted"',
  },
  minlayer: {
    name: 'Minimum layer time',
    unintuitive: true,
    prusa: '"Slow down if layer print time is below" (Filament → Cooling)',
    orca: '"Slow printing down for better layer cooling" + "Layer time"',
    cura: '"Minimum Layer Time"',
  },
  seam: {
    name: 'Seam position',
    unintuitive: true,
    prusa: '"Seam position"',
    orca: '"Seam position"',
    cura: '"Z Seam Alignment"',
  },
  pa: {
    name: 'Pressure advance',
    unintuitive: true,
    prusa: 'No slicer field; set M572 (or M900 Linear Advance) in Filament → Custom G-code',
    orca: '"Pressure advance" (Filament settings) plus its calibration tool',
    cura: 'No built-in setting; set in printer firmware',
  },
  overlap: {
    name: 'Infill/wall overlap',
    unintuitive: true,
    prusa: '"Infill/perimeters overlap"',
    orca: '"Infill/Wall overlap"',
    cura: '"Infill Overlap Percentage"',
  },
  toplayers: {
    name: 'Top layers',
    unintuitive: true,
    prusa: '"Top" solid layers',
    orca: '"Top shell layers"',
    cura: '"Top Layers"',
  },
  fanfirst: {
    name: 'No fan on first layers',
    unintuitive: true,
    prusa: '"Disable fan for the first N layers"',
    orca: '"No cooling for the first N layers"',
    cura: '"Initial Fan Speed" + "Regular Fan Speed at Layer"',
  },
  linewidth: {
    name: 'Line width',
    unintuitive: true,
    prusa: '"Extrusion width"',
    orca: '"Line width"',
    cura: '"Line Width"',
  },
  bridgefan: {
    name: 'Bridge fan speed',
    unintuitive: true,
    prusa: '"Bridges fan speed"',
    orca: '"Overhangs and external bridges fan speed" (enable "Force cooling for overhangs and bridges")',
    cura: '"Bridge Fan Speed" (Experimental → Enable Bridge Settings)',
  },
  inputshaping: {
    name: 'Input shaping',
    unintuitive: true,
    prusa: 'Firmware feature on Prusa printers, not a slicer setting',
    orca: 'Firmware feature (Klipper "input shaper", Bambu calibration); Orca has a test print',
    cura: 'Not a slicer setting; configured in firmware',
  },
  retraction: { name: 'Retraction', prusa: '"Retraction length"', orca: '"Retraction length"', cura: '"Retraction Distance"' },
  fan: { name: 'Part cooling fan', prusa: '"Fan speed" (Filament → Cooling)', orca: 'Min/Max "Fan speed" (Filament → Cooling → Part cooling fan)', cura: '"Fan Speed"' },
  speed: { name: 'Print speed', prusa: 'Print settings → Speed', orca: 'Speed tab', cura: '"Print Speed"' },
  brim: { name: 'Brim', prusa: '"Brim width"', orca: '"Brim type / width"', cura: 'Build Plate Adhesion → Brim' },
  raft: { name: 'Raft', prusa: '"Raft layers"', orca: '"Raft layers"', cura: 'Build Plate Adhesion → Raft' },
  surface: { name: 'Bed surface' },
  firstlayer: { name: 'First layer settings' },
  travel: { name: 'Travel speed' },
  anneal: { name: 'Annealing' },
  support: { name: 'Support interface' },
  ironing: { name: 'Ironing', prusa: '"Ironing"', orca: '"Ironing"', cura: '"Enable Ironing"' },
}

export const SLICER_NAMES = { prusa: 'PrusaSlicer', orca: 'OrcaSlicer / Bambu Studio', cura: 'Cura' }
