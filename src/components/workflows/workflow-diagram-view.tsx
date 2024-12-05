import "reactflow/dist/style.css";

import ELK from "elkjs/lib/elk.bundled.js";
import React, { useEffect } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Connection,
  Controls,
  Edge,
  MiniMap,
  Node,
  useEdgesState,
  useNodesState,
} from "reactflow";

import { WorkflowDetailedDTO } from "@/types/workflows"; // Correct import for bundled ELK

const elk = new ELK();

const getLayoutedElements = async (
  nodes: Node[],
  edges: Edge[],
  direction: "LR" | "TB" | "RL" | "BT" = "TB",
): Promise<{ nodes: Node[]; edges: Edge[] }> => {
  const elkGraph = {
    id: "root",
    layoutOptions: {
      "elk.algorithm": "layered", // Ensure hierarchical layout
      "elk.direction": direction, // Vertical direction
      "elk.spacing.nodeNode": "80", // Increased spacing between nodes
      "elk.spacing.edgeNode": "50", // Increased spacing between edges and nodes
    },
    children: nodes.map((node) => ({
      id: node.id,
      width: 172,
      height: 36,
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    })),
  };

  const layout = await new ELK().layout(elkGraph);

  const layoutedNodes = nodes.map((node) => {
    const layoutNode = layout.children?.find((child) => child.id === node.id);
    return {
      ...node,
      position: {
        x: layoutNode?.x || 0,
        y: layoutNode?.y || 0,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

const WorkflowDiagram: React.FC<{ workflowDetails: WorkflowDetailedDTO }> = ({
  workflowDetails,
}) => {
  const generateGraphElements = (
    data: WorkflowDetailedDTO,
  ): { nodes: Node[]; edges: Edge[] } => {
    const nodes: Node[] = data.states.map((state) => ({
      id: state.id?.toString() || "",
      data: { label: state.stateName },
      type: "default",
      style: {
        background: state.isInitial
          ? "#DFFFD6"
          : state.isFinal
            ? "#FFD6D6"
            : "#FFFFFF",
        border: "1px solid #1A192B",
        borderRadius: "5px",
        padding: "10px",
      },
      position: { x: 0, y: 0 }, // Default position
    }));

    const edges: Edge[] = data.transitions.map((transition) => ({
      id: `${transition.sourceStateId}-${transition.targetStateId}`,
      source: transition.sourceStateId.toString(),
      target: transition.targetStateId.toString(),
      label: transition.eventName,
      animated: true,
      labelStyle: {
        fontSize: "12px",
        fontWeight: "bold",
        backgroundColor: "white",
        padding: "2px",
        borderRadius: "4px",
        zIndex: 10,
      },
    }));

    return { nodes, edges };
  };

  const { nodes: initialNodes, edges: initialEdges } =
    generateGraphElements(workflowDetails);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    const layoutGraph = async () => {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        await getLayoutedElements(
          initialNodes,
          initialEdges,
          "TB", // Top-to-Bottom layout
        );
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    };

    layoutGraph();
  }, [initialNodes, initialEdges]);

  const onConnect = (params: Edge<any> | Connection) =>
    setEdges((eds) => addEdge({ ...params, animated: true }, eds));

  return (
    <div style={{ width: "100%", height: "500px" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background variant="cross" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default WorkflowDiagram;
