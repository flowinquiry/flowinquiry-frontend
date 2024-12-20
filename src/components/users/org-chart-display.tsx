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
  Connection,
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
  subordinates: UserInfoNode[]; // Recursive type for hierarchy
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
          subordinates: [
            {
              id: "8",
              name: "Alice Green (Frontend Developer)",
              avatarUrl: "https://via.placeholder.com/100",
              userPageLink: "/users/8",
              subordinates: [],
            },
            {
              id: "9",
              name: "Bob Yellow (Backend Developer)",
              avatarUrl: "https://via.placeholder.com/100",
              userPageLink: "/users/9",
              subordinates: [],
            },
            {
              id: "10",
              name: "Charlie White (UI Designer)",
              avatarUrl: "https://via.placeholder.com/100",
              userPageLink: "/users/10",
              subordinates: [],
            },
            {
              id: "11",
              name: "Diana Black (DevOps Engineer)",
              avatarUrl: "https://via.placeholder.com/100",
              userPageLink: "/users/11",
              subordinates: [],
            },
          ],
        },
        {
          id: "5",
          name: "Sara White (QA Lead)",
          avatarUrl: "https://via.placeholder.com/100",
          userPageLink: "/users/5",
          subordinates: [
            {
              id: "12",
              name: "Ella Pink (QA Analyst)",
              avatarUrl: "https://via.placeholder.com/100",
              userPageLink: "/users/12",
              subordinates: [],
            },
            {
              id: "13",
              name: "Frank Grey (Automation Engineer)",
              avatarUrl: "https://via.placeholder.com/100",
              userPageLink: "/users/13",
              subordinates: [],
            },
          ],
        },
        {
          id: "6",
          name: "Tom Brown (Project Manager)",
          avatarUrl: "https://via.placeholder.com/100",
          userPageLink: "/users/6",
          subordinates: [
            {
              id: "14",
              name: "Grace Silver (Scrum Master)",
              avatarUrl: "https://via.placeholder.com/100",
              userPageLink: "/users/14",
              subordinates: [],
            },
            {
              id: "15",
              name: "Hank Gold (Business Analyst)",
              avatarUrl: "https://via.placeholder.com/100",
              userPageLink: "/users/15",
              subordinates: [],
            },
          ],
        },
      ],
    },
    {
      id: "3",
      name: "Tom Green (CFO)",
      avatarUrl: "https://via.placeholder.com/100",
      userPageLink: "/users/3",
      subordinates: [
        {
          id: "7",
          name: "Mary Blue (Financial Analyst)",
          avatarUrl: "https://via.placeholder.com/100",
          userPageLink: "/users/7",
          subordinates: [
            {
              id: "16",
              name: "Ivan Teal (Junior Analyst)",
              avatarUrl: "https://via.placeholder.com/100",
              userPageLink: "/users/16",
              subordinates: [],
            },
            {
              id: "17",
              name: "Jack Cyan (Intern)",
              avatarUrl: "https://via.placeholder.com/100",
              userPageLink: "/users/17",
              subordinates: [],
            },
          ],
        },
      ],
    },
  ],
};

const OrgChartView = () => {
  const [rootUser, setRootUser] = useState<UserInfoNode>(orgData); // Dynamic root user
  const [nodes, setNodes, onNodesChange] = useNodesState<
    Node<Record<string, unknown>>
  >([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<
    Edge<Record<string, unknown>>
  >([]);

  // Generate chart nodes and edges dynamically
  const generateChart = (user: UserInfoNode, level = 2) => {
    const nodes: Node<Record<string, unknown>>[] = [];
    const edges: Edge<Record<string, unknown>>[] = [];

    const traverse = (node: UserInfoNode, currentLevel: number) => {
      if (currentLevel > level) return;

      nodes.push({
        id: node.id,
        type: "custom", // Matches nodeTypes key
        data: {
          label: node.name,
          avatarUrl: node.avatarUrl,
          userPageLink: node.userPageLink,
          onClick: () => setRootUser(node), // Set this node as root
        },
        position: { x: 0, y: 0 },
      });

      node.subordinates.forEach((sub) => {
        edges.push({
          id: `e${node.id}-${sub.id}`,
          source: node.id,
          target: sub.id,
          animated: true,
          markerEnd: { type: MarkerType.Arrow },
        });
        traverse(sub, currentLevel + 1);
      });
    };

    traverse(user, 1);
    return { nodes, edges };
  };

  useEffect(() => {
    const { nodes, edges } = generateChart(rootUser);
    const { nodes: layoutedNodes, edges: layoutedEdges } = applyLayout(
      nodes,
      edges,
    );
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [rootUser]);

  const onConnect = (connection: Connection) =>
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
