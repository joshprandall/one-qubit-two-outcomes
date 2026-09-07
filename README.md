# One qubit. Two outcomes.

[![Tests](https://github.com/joshprandall/one-qubit-two-outcomes/actions/workflows/test.yml/badge.svg)](https://github.com/joshprandall/one-qubit-two-outcomes/actions/workflows/test.yml)

An interactive browser model for a restricted pure single-qubit state and computational-basis measurement.

## State model

The project uses:

```text
|ψ⟩ = cos(θ/2)|0⟩ + sin(θ/2)|1⟩
```

with:

```text
0° ≤ θ ≤ 180°
relative phase φ = 0
```

The two real amplitudes are:

```text
α = cos(θ/2)
β = sin(θ/2)
```

and the computational-basis measurement probabilities are:

```text
P(0) = |α|² = cos²(θ/2)
P(1) = |β|² = sin²(θ/2)
```

Because `cos²(x) + sin²(x) = 1`, the state remains normalized throughout the slider range.

## What the interactive demonstrates

- `θ = 0°` produces state `|0⟩`.
- `θ = 90°` produces equal measurement probabilities.
- `θ = 180°` produces state `|1⟩`.
- Intermediate angles continuously change the two probabilities.
- Repeated measurements are sampled from the current probability distribution.
- Larger shot counts typically move observed frequencies closer to the model probabilities.

## What it deliberately leaves out

This is a small teaching model, not a general quantum simulator.

It does not model:

- Arbitrary relative phase.
- Multi-qubit systems or entanglement.
- Gates or circuit execution.
- Noise, decoherence, device topology, calibration, or error correction.
- Quantum hardware.

The sampling is performed classically in the browser.

## Run locally

No installation is required for the interactive itself. Open `index.html` in a modern browser, or serve the folder with a static HTTP server.

For example:

```sh
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Tests

Requires Node.js 22 or newer.

```sh
npm test
```

The automated suite covers:

- Angle conversion.
- `|0⟩`, equal-superposition, and `|1⟩` boundary states.
- State normalization across every integer angle from 0° through 180°.
- Complementary probabilities.
- Deterministic sampling with an injected random source.
- Certain measurement outcomes.
- Invalid inputs.
- Core static-page accessibility hooks.

GitHub Actions runs the test suite on pushes and pull requests.

## Project structure

```text
one-qubit-two-outcomes/
├── .github/
│   └── workflows/
│       └── test.yml
├── tests/
│   ├── qubit.test.mjs
│   └── site.test.mjs
├── app.js
├── index.html
├── package.json
├── qubit.js
├── styles.css
└── README.md
```

## Portfolio context

This project isolates the single-qubit interactive from the larger engineering portfolio so the mathematical model, implementation boundaries, and testable behavior can be reviewed independently.
