import React, { useEffect, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidBlockProps {
  children: React.ReactNode;
}

const MermaidBlock: React.FC<MermaidBlockProps> = ({ children }) => {
  const diagramCode = React.Children.toArray(children).join('');
  const [svg, setSvg] = useState<string>('');
  const [showSource, setShowSource] = useState<boolean>(false);
  // orientation state: "TD" for vertical, "LR" for horizontal.
  const [orientation, setOrientation] = useState<'TD' | 'LR'>('TD');
  const handleCopy = (textContent: string) => {
    navigator.clipboard.writeText(textContent);
  };
  // Compute new diagram code based on orientation.
  // Updated regex to match both "graph" and "flowchart" followed by orientation.
  const formattedCode = diagramCode.replace(/^(graph|flowchart)\s+(TD|LR)/i, `$1 ${orientation}`);
  
  useEffect(() => {
    mermaid.initialize({ startOnLoad: false });
    const id = 'mermaid-' + Math.random().toString(36).substr(2, 9);
    const container = document.createElement('div');
    // Hide container with opacity so layout is computed.
    container.style.opacity = '0';
    container.style.position = 'absolute';
    container.style.pointerEvents = 'none';
    document.body.appendChild(container);

    const renderDiagram = async () => {
      try {
        const generatedSvg = await mermaid.mermaidAPI.render(id, formattedCode, container);
        // generatedSvg.svg now holds the properly rendered SVG.
        setSvg(generatedSvg.svg);
      } catch (error) {
        console.error('Mermaid rendering error:', error);
      } finally {
        document.body.removeChild(container);
      }
    };

    renderDiagram();
  }, [formattedCode]);

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => handleCopy(diagramCode)}
          className="px-2 py-1 bg-gray-300 text-xs rounded"
        >
            Copy
        </button>
        <button
          onClick={() => setShowSource(!showSource)}
          className="px-2 py-1 bg-gray-300 text-xs rounded"
        >
          {showSource ? 'View Diagram' : 'View Code'}
        </button>
        <button
          onClick={() => setOrientation(orientation === 'TD' ? 'LR' : 'TD')}
          className="px-2 py-1 bg-gray-300 text-xs rounded"
        >
          {orientation === 'TD' ? 'Switch to Horizontal' : 'Switch to Vertical'}
        </button>
      </div>
      {showSource ? (
        <pre className="overflow-auto p-2 bg-gray-800 text-white rounded">
          <code>{formattedCode}</code>
        </pre>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: svg }} />
      )}
    </div>
  );
};

export default MermaidBlock;