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

import { Breadcrumbs } from "@/components/breadcrumbs";
import { Heading } from "@/components/heading";
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
      } as Node<Record<string, unknown>>;
    }),
    edges,
  };
};

const OrgChartView = ({ userId }: { userId?: number }) => {
  const [rootUser, setRootUser] = useState<UserHierarchyDTO | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<
    Node<Record<string, unknown>>
  >([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<
    Edge<Record<string, unknown>>
  >([]);

  // Generate chart nodes and edges dynamically
  const generateChart = (data: UserHierarchyDTO) => {
    const nodes: Node<Record<string, unknown>>[] = [];
    const edges: Edge<Record<string, unknown>>[] = [];

    // Add manager node (if exists)
    if (data.managerId) {
      nodes.push({
        id: data.managerId.toString(),
        type: "custom",
        data: {
          label: data.managerName,
          avatarUrl: data.managerImageUrl,
          userPageLink: `/users/${data.managerId}`,
          onClick: () =>
            setRootUser({ id: data.managerId } as UserHierarchyDTO),
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

    // Add the current node
    nodes.push({
      id: data.id.toString(),
      type: "custom",
      data: {
        label: data.name,
        avatarUrl: data.imageUrl,
        userPageLink: `/users/${data.id}`,
        onClick: () => setRootUser(data),
      },
      position: { x: 0, y: 0 },
    });

    // Add subordinates
    data.subordinates?.forEach((sub) => {
      nodes.push({
        id: sub.id.toString(),
        type: "custom",
        data: {
          label: sub.name,
          avatarUrl: sub.imageUrl,
          userPageLink: `/users/${sub.id}`,
          onClick: () => setRootUser(sub),
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

  // Fetch the org chart when rootUser changes
  useEffect(() => {
    const loadOrgChart = async () => {
      try {
        const data = rootUser?.id
          ? await getUserHierarchy(rootUser.id)
          : await getOrgChart();
        setRootUser(data);
      } catch (error) {
        console.error("Failed to load org chart:", error);
      }
    };

    loadOrgChart();
  }, [rootUser?.id]);

  // Update chart dynamically when rootUser changes
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
    <div>
      <Breadcrumbs items={[{ title: "Org Chart", link: "#" }]} />
      <div className="py-4">
        <Heading title="Org Chart" description="Organization Hierarchy" />
      </div>
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
    </div>
  );
};

export default OrgChartView;
