"use client";

import React, { useState, useEffect } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  addEdge,
  useNodesState,
  useEdgesState,
  Edge,
  Node,
  MarkerType,
  Position,
} from "@xyflow/react";
import dagre from "@dagrejs/dagre";
import "@xyflow/react/dist/style.css";
import PersonNode from "@/components/users/org-chart-node";

const nodeWidth = 200;
const nodeHeight = 100;

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));
dagreGraph.setGraph({ rankdir: "TB" }); // Top-to-bottom layout

const applyLayout = (
  nodes: Node<Record<string, unknown>>[],
  edges: Edge<Record<string, unknown>>[],
) => {
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return {
    nodes: nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      return {
        ...node,
        position: {
          x: nodeWithPosition.x - nodeWidth / 2,
          y: nodeWithPosition.y - nodeHeight / 2,
        },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      } as Node<Record<string, unknown>>; // Explicitly cast as Node
    }),
    edges,
  };
};

// Define the type for user nodes
interface UserInfoNode {
  id: string;
  name: string;
  avatarUrl: string;
  userPageLink: string;
  subordinates: UserInfoNode[];
  parent?: UserInfoNode | null; // Reference to the parent node
}

// Sample hierarchical data
const orgData: UserInfoNode = {
  id: "1",
  name: "John Doe (CEO)",
  avatarUrl: "https://via.placeholder.com/100",
  userPageLink: "/users/1",
  subordinates: [
    {
      id: "2",
      name: "Jane Smith (CTO)",
      avatarUrl: "https://via.placeholder.com/100",
      userPageLink: "/users/2",
      subordinates: [
        {
          id: "4",
          name: "Jim Brown (Lead Developer)",
          avatarUrl: "https://via.placeholder.com/100",
          userPageLink: "/users/4",
          subordinates: [],
        },
        {
          id: "5",
          name: "Sara White (QA Lead)",
          avatarUrl: "https://via.placeholder.com/100",
          userPageLink: "/users/5",
          subordinates: [],
        },
      ],
    },
    {
      id: "3",
      name: "Tom Green (CFO)",
      avatarUrl: "https://via.placeholder.com/100",
      userPageLink: "/users/3",
      subordinates: [],
    },
  ],
};

const setParentReferences = (
  node: UserInfoNode,
  parent: UserInfoNode | null = null,
) => {
  node.parent = parent;
  node.subordinates.forEach((sub) => setParentReferences(sub, node));
};

setParentReferences(orgData);

const OrgChartView = () => {
  const [rootUser, setRootUser] = useState<UserInfoNode>(orgData); // Dynamic root user
  const [nodes, setNodes, onNodesChange] = useNodesState<
    Node<Record<string, unknown>>
  >([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<
    Edge<Record<string, unknown>>
  >([]);

  // Generate chart nodes and edges dynamically
  const generateChart = (node: UserInfoNode) => {
    const nodes: Node<Record<string, unknown>>[] = [];
    const edges: Edge<Record<string, unknown>>[] = [];

    // Add parent node (if exists)
    if (node.parent) {
      nodes.push({
        id: node.parent.id,
        type: "custom",
        data: {
          label: node.parent.name,
          avatarUrl: node.parent.avatarUrl,
          userPageLink: node.parent.userPageLink,
          onClick: () => setRootUser(node.parent),
        },
        position: { x: 0, y: 0 },
      });

      edges.push({
        id: `e${node.parent.id}-${node.id}`,
        source: node.parent.id,
        target: node.id,
        animated: true,
        markerEnd: { type: MarkerType.Arrow },
      });
    }

    // Add the current node
    nodes.push({
      id: node.id,
      type: "custom",
      data: {
        label: node.name,
        avatarUrl: node.avatarUrl,
        userPageLink: node.userPageLink,
        onClick: () => setRootUser(node),
      },
      position: { x: 0, y: 0 },
    });

    // Add subordinates
    node.subordinates.forEach((sub) => {
      nodes.push({
        id: sub.id,
        type: "custom",
        data: {
          label: sub.name,
          avatarUrl: sub.avatarUrl,
          userPageLink: sub.userPageLink,
          onClick: () => setRootUser(sub),
        },
        position: { x: 0, y: 0 },
      });

      edges.push({
        id: `e${node.id}-${sub.id}`,
        source: node.id,
        target: sub.id,
        animated: true,
        markerEnd: { type: MarkerType.Arrow },
      });
    });

    return { nodes, edges };
  };

  // Update chart dynamically when rootUser changes
  useEffect(() => {
    const { nodes, edges } = generateChart(rootUser);
    const { nodes: layoutedNodes, edges: layoutedEdges } = applyLayout(
      nodes,
      edges,
    );
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [rootUser]);

  const onConnect = (connection: any) =>
    setEdges((eds) => addEdge(connection, eds));

  return (
    <ReactFlowProvider>
      <div style={{ height: "100vh", width: "100%" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          attributionPosition="bottom-left"
          nodeTypes={{ custom: PersonNode }}
        >
          <Background gap={16} size={0.5} />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
};

export default OrgChartView;
