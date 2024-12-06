import React from "react";
import { Handle, Position } from "reactflow";

const CustomNode = ({
  data,
}: {
  data: { label: string; backgroundColor: string };
}) => {
  return (
    <div
      style={{
        backgroundColor: data.backgroundColor,
        color: "#FFFFFF",
        border: "1px solid #1A192B",
        borderRadius: "5px",
        padding: "10px",
        textAlign: "center",
      }}
    >
      {data.label}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default CustomNode;
