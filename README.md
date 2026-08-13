# Slot Game (PixiJS) by Andrei Buzu

Basic 5×3 slot machine built with **PixiJS**, **TypeScript** and **Vite**, for the frontend programming exercise.

## Features

- Preloader with centered load percentage (`PIXI.Text`)
- 5 reels × 3 rows using provided symbol sprites
- Spin button (random stop positions, no spin animation)
- 7 paylines, left-to-right wins from the paytable
- Multiline win text that scales to fit the viewport
- Responsive layout (portrait / landscape) on window resize
- Optional: press **Space** to spin

## Requirements

- Node.js 20.18.0 (recommended)

## Setup

```bash
npm install
```

## Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm test` | Run Vitest unit tests |
| `npm run build` | Typecheck + production build |

## Project structure

```
assets/                 # Public game images (symbols + spin button)
src/
  index.ts              # Entry point
  app.ts                # Pixi Application, preloader → game, resize
  config/
    GameConfig.ts       # Reel bands, paytable, paylines, asset paths
    types.ts            # SymbolId, Screen, MatchCount
  reels/
    Reel.ts             # Single reel band + stop position
    ReelSet.ts          # 5 reels, screen matrix, spin
    ReelsView.ts        # PIXI sprites for the visible screen
  paylines/
    Payline.ts          # Left-to-right match on one line
    WinCalculator.ts    # Evaluates all paylines
    WinResult.ts        # Total + display text
    LineWin.ts          # Win line type
  button/
    SpinButton.ts       # Spin control
  ui/
    Preloader.ts        # Asset loading UI
    GameScreen.ts       # Layout + spin flow
    WinText.ts          # Scaled multiline wins text
  tests/
    game.test.ts        # Screen + payline examples from the brief
```

## How it works

1. **Preloader** loads all symbol + button textures and shows progress %.
2. **GameScreen** shows the reel grid, spin button and win text.
3. On spin, each reel picks a random stop index on its band; the 3×5 screen is rebuilt.
4. **WinCalculator** walks the 7 paylines left → right; 3+ matching symbols pay from the paytable.
5. Win text format:

```
Total wins: 6
- payline 2, hv2 x3, 5
- payline 5, lv3 x3, 1
```

## Notes

- Math model (bands, paytable, paylines) lives in `GameConfig` so it is easy to change without touching UI.
- Unit tests cover the brief’s screen/win examples (`npm test`).
- On wide screens the spin button sits beside the reels (I find it more user-friendly and fills up the screen better); on portrait it sits below (as in the brief). 
- Built with TypeScript for clearer types around `SymbolId` / paytable keys; runtime is still ES modules in the browser via Vite.

> [!CAUTION]
> **Known error in the programming exercise brief**  
> For positions `5, 14, 9, 9, 16`, the brief shows bottom-left as `lv1` and **Total wins: 10** (paylines 6 and 7).  
> Using the provided reel bands, Band 1 at stop `5` is `lv1, hv1, hv4`, so bottom-left is **`hv4`**.  
> Correct result: only **payline 6** wins (`lv1 x4` → 5). **Total wins: 5**. Payline 7 does not win.  


