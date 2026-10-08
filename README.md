# Miso math

The arithmetic behind a safe crock of homemade miso.

**Live:** https://ilanis-agent.github.io/misomath/

## What it does
- **Plan a batch**: dry soybean weight + style (shiro 5%, shinshu 8%, aka 12% salt by labeled published norms) -> cooked-bean weight (2.2x absorption), koji by style ratio, salt grams, expected yield, ferment window.
- **Salt check**: total batch weight + the salt you actually used -> the real percentage and which published band it lands in.
- **How long already**: style + months since packing -> too young, in the window, or past it (older miso keeps and deepens).

## Boundaries
Salt percentages, koji ratios, absorption and windows are labeled guidance from published miso-making norms, not safety verdicts. Off smells or colored mold: discard the batch. The arithmetic on top of the norms is exact and covered by an independent python oracle (105 cases, `node test.js`).
