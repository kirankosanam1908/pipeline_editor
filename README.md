# Pipeline Editor (DAG Builder)

A React-based visual editor for creating and managing Directed Acyclic Graphs (DAG). This tool enables users to create and visualize data pipelines or processing workflows using interconnected nodes.

## Features

- **Node Management**
  - Create nodes with custom labels
  - Three node types: Input (Green), Process (Blue), Output (Purple)
  - Delete nodes using Delete/Backspace key
  - Drag nodes to reposition

- **Edge Management**
  - Create connections between nodes
  - Animated edge flows
  - Validate connection rules
  - Delete connections

- **DAG Validation**
  - Minimum 2 nodes required
  - No cycles allowed
  - All nodes must be connected
  - No self-loops permitted
  - Real-time validation feedback

- **Additional Features**
  - Auto-layout functionality
  - JSON structure preview
  - Grid snapping
  - Zoom and pan controls

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

## Project Structure
```
src/
├── components/
│   ├── DAGEditor/
│   │   └── DAGEditor.tsx
│   ├── NodeComponent/
│   │   └── NodeComponent.tsx
│   ├── Controls/
│   │   └── CustomControls.tsx
│   ├── ValidationStatus/
│   │   └── ValidationStatus.tsx
│   └── JsonPreview/
│       └── JsonPreview.tsx
├── utils/
│   ├── dagValidation.ts
│   └── layoutUtils.ts
├── types/
│   └── index.ts
├── App.tsx
├── index.css
└── main.tsx
```

## Usage

### Adding Nodes
- Click "Add Node" button
- Enter node name when prompted
- Node will be created with a random type

### Creating Connections
- Click and drag from a node's right handle to another node's left handle
- Valid connections will be animated
- Invalid connections will be prevented

### Auto Layout
- Click "Auto Layout" to organize nodes in a left-to-right flow
- Nodes will be automatically positioned for better visualization

### Controls
- Mouse wheel: Zoom in/out
- Mouse drag: Pan canvas
- Delete/Backspace: Remove selected elements
- Clear button: Remove all elements

## Dependencies

- React
- React Flow
- TypeScript
- Tailwind CSS
- Dagre (for auto-layout)

## Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Open `http://localhost:5173` in your browser

## Notes

- The editor enforces DAG rules to maintain valid pipeline structures
- Real-time validation provides immediate feedback
- JSON preview helps understand the underlying data structure
- Auto-layout helps organize complex pipelines

---
Built with React Flow and Tailwind CSS.