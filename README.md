# FastSyn — Fast Synaptic Adaptation in AI

> **“The weights stay fixed. The memory adapts.”**

FastSyn is a production-grade interactive scientific web application and research laboratory for exploring inference-time dynamic memory adaptation with strictly frozen model parameters ($W_{\text{frozen}}$).

---

## 🌟 Key Features

- **Real Mathematical Simulation Engine**:
  - Arbitrary sequence lengths: $N \in [20, 1000]$ steps.
  - Environment distribution shift severity: $\delta \in [0.0, 1.0]$.
  - Fast-weight retention rate: $\lambda \in [0.10, 0.99]$.
  - Synaptic update strength: $\eta \in [0.05, 1.50]$.
  - 100% deterministic seeded pseudo-random streams.
- **4 Real Models Computed in Parallel**:
  1. **Static Baseline**: $0$B dynamic state. Collapses under distribution shifts.
  2. **Transformer Key-Value Cache**: Context grows linearly $O(N)$ with sequence length.
  3. **State-Space Model (SSM)**: Constant $16$B hidden vector recurrence.
  4. **FastSyn / BDH Plastic Synapses**: Strictly constant **$O(1)$** matrix ($64$ Bytes float32), independent of sequence length.
- **3-Panel Scientific Workstation**:
  - **Environment Controls**: Sliders for Shift %, Retention %, Update Strength, Sequence Length ($20 \to 1000$), Seed generator, and stream playback.
  - **Memory Forensics**: Side-by-side $4 \times 4$ heatmaps of $W_{\text{frozen}}$ (locked parameter substrate) vs $M_t$ (dynamic RAM plasticity) with hover coordinate tooltips and toggleable WebGL 3D Synaptic Network.
  - **Performance Telemetry**: Live computed accuracy leaderboard, pre/post shift breakdown, per-step token prediction confidence distribution, and local bookmark manager.
- **Complexity & Telemetry Inspector**:
  - Live SVG curve proving FastSyn memory is strictly flat at $64$ Bytes as $N \to 1000$, while Transformer KV cache scales to $32,000+$ Bytes.
  - Export Telemetry to JSON.
- **Visual Design**:
  - Deep luxury dark purple palette (`#06020e`).
  - Interactive WebGL Three.js iridescent liquid chrome sculpture with vertical purple aurora beam and mouse parallax.
  - High-end editorial typography combining modern sans with Cormorant Garamond luxury serif.
  - Complete user flow: **Landing Page ➔ Research Access / Login Portal ➔ Dashboard Laboratory Workstation**.

---

## 📐 Mathematical Formulation

$$M_{t+1} = \lambda M_t + \eta (v_t \otimes k_t^T)$$

$$W_{\text{eff}} = W_{\text{frozen}} + M_t$$

$$y_t = \text{softmax}(W_{\text{eff}} x_t + b)$$

- $W_{\text{frozen}} \in \mathbb{R}^{d \times d}$: Strictly fixed learned base parameters ($\|\Delta W\| = 0$).
- $M_t \in \mathbb{R}^{d \times d}$: Dynamic synaptic memory updated in RAM via Hebbian outer-product writing.
- **Zero Backpropagation**: Streaming real-time adaptation without computational gradient loops.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/srixram08/FastSyn.git
cd FastSyn

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm run start
```

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **3D Graphics**: Three.js / WebGL
- **Styling**: Tailwind CSS & Liquid Glass Design System
- **Icons**: Lucide React
- **Typography**: Cormorant Garamond, Inter, JetBrains Mono

---

## 📄 License

MIT License © 2026 DataForge / FastSyn Team
