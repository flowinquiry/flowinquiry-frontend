"use client";

import "@xyflow/react/dist/style.css";

import dagre from "@dagrejs/dagre";
import {
  addEdge,
  Background,
  Edge,
  MarkerType,
  Node,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import React, { useEffect, useState } from "react";

import PersonNode from "@/components/users/org-chart-node";
import { getOrgChart, getUserHierarchy } from "@/lib/actions/users.action";

// Define the type for the user hierarchy DTO
export interface UserHierarchyDTO {
  id: number;
  name: string;
  imageUrl: string;
  managerId: number | null;
  managerName: string | null;
  managerImageUrl: string | null;
  subordinates: UserHierarchyDTO[];
}

const nodeWidth = 200;
const nodeHeight = 100;

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));
dagreGraph.setGraph({ rankdir: "TB" }); // Top-to-bottom layout

const applyLayout = (
  nodes: Node<Record<string, unknown>>[],
  edges: Edge<Record<string, unknown>>[],
) => {
  // Clear the graph
  dagreGraph.nodes().forEach((node) => dagreGraph.removeNode(node));
  dagreGraph.edges().forEach(({ v, w }) => dagreGraph.removeEdge(v, w)); // Corrected

  // Add nodes and edges
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Perform layout
  dagre.layout(dagreGraph);

  return {
    nodes: nodes.map((node) => {
      const position = dagreGraph.node(node.id);
      return {
        ...node,
        position: {
          x: position.x - nodeWidth / 2,
          y: position.y - nodeHeight / 2,
        },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      } as Node<Record<string, unknown>>;
    }),
    edges,
  };
};

const OrgChartView = ({ userId }: { userId?: number }) => {
  const [rootUserId, setRootUserId] = useState<number | undefined>(userId);
  const [rootUser, setRootUser] = useState<UserHierarchyDTO | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<
    Node<Record<string, unknown>>
  >([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<
    Edge<Record<string, unknown>>
  >([]);
  const DUMMY_MANAGER_ID = -1;

  const generateChart = (data: UserHierarchyDTO) => {
    const nodes: Node<Record<string, unknown>>[] = [];
    const edges: Edge<Record<string, unknown>>[] = [];

    if (data.id === DUMMY_MANAGER_ID) {
      nodes.push({
        id: DUMMY_MANAGER_ID.toString(),
        type: "custom",
        data: {
          label: "Top-Level Manager",
          avatarUrl: "",
          userPageLink: "#",
          onClick: () => setRootUserId(DUMMY_MANAGER_ID),
        },
        position: { x: 0, y: 0 },
      });

      data.subordinates.forEach((sub) => {
        nodes.push({
          id: sub.id.toString(),
          type: "custom",
          data: {
            label: sub.name,
            avatarUrl: sub.imageUrl,
            userPageLink: `/users/${sub.id}`,
            onClick: () => setRootUserId(sub.id),
          },
          position: { x: 0, y: 0 },
        });

        edges.push({
          id: `e${DUMMY_MANAGER_ID}-${sub.id}`,
          source: DUMMY_MANAGER_ID.toString(),
          target: sub.id.toString(),
          animated: true,
          markerEnd: { type: MarkerType.Arrow },
        });
      });

      return { nodes, edges };
    }

    if (data.managerId) {
      nodes.push({
        id: data.managerId.toString(),
        type: "custom",
        data: {
          label: data.managerName,
          avatarUrl: data.managerImageUrl,
          userPageLink: `/users/${data.managerId}`,
          onClick: () => setRootUserId(data.managerId ?? undefined),
        },
        position: { x: 0, y: 0 },
      });

      edges.push({
        id: `e${data.managerId}-${data.id}`,
        source: data.managerId.toString(),
        target: data.id.toString(),
        animated: true,
        markerEnd: { type: MarkerType.Arrow },
      });
    }

    nodes.push({
      id: data.id.toString(),
      type: "custom",
      data: {
        label: data.name,
        avatarUrl: data.imageUrl,
        userPageLink: `/users/${data.id}`,
        onClick: () => setRootUserId(data.id),
      },
      position: { x: 0, y: 0 },
    });

    data.subordinates.forEach((sub) => {
      nodes.push({
        id: sub.id.toString(),
        type: "custom",
        data: {
          label: sub.name,
          avatarUrl: sub.imageUrl,
          userPageLink: `/users/${sub.id}`,
          onClick: () => setRootUserId(sub.id),
        },
        position: { x: 0, y: 0 },
      });

      edges.push({
        id: `e${data.id}-${sub.id}`,
        source: data.id.toString(),
        target: sub.id.toString(),
        animated: true,
        markerEnd: { type: MarkerType.Arrow },
      });
    });

    return { nodes, edges };
  };

  useEffect(() => {
    const loadOrgChart = async () => {
      try {
        const data =
          rootUserId === DUMMY_MANAGER_ID
            ? await getOrgChart()
            : rootUserId === undefined
              ? await getOrgChart()
              : await getUserHierarchy(rootUserId);
        setRootUser(data);
      } catch (error) {
        console.error("Failed to load org chart:", error);
      }
    };

    loadOrgChart();
  }, [rootUserId]);

  useEffect(() => {
    if (!rootUser) return;
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
      <div style={{ height: "50rem", width: "100%" }}>
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
