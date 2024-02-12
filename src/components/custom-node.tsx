import { FC, memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import CustomNodeIcon from "@/components/custom-node-icon.tsx";
import { NodeType, VariableType } from "@/variable-map/types.ts";
import { colorMapping } from "@/variable-map/utils/entity-config.ts";

interface CustomNodeData {
  label: string;
  type: NodeType;
  showValueType: VariableType;
}

const CustomNode: FC<NodeProps<CustomNodeData>> = ({ data }) => {
  const label = data.label;
  const type = data.type;
  const borderColor = colorMapping[type].border;
  const backgroundColor = colorMapping[type].background;
  const icon = CustomNodeIcon({ type, showValueType: data.showValueType });

  return (
    <div
      style={{
        borderColor: borderColor,
      }}
      className={"min-w-40 relative rounded-lg bg-white border-2"}
    >
      <Handle type="target" position={Position.Left} />
      <div className="flex items-center py-2 px-3">
        <div className={"gap-2 flex items-center"}>
          <div
            style={{
              backgroundColor: backgroundColor,
            }}
            className={"flex w-8 h-8 rounded-full items-center justify-center"}
          >
            {icon}
          </div>
          <div className={"font-semibold text-sm"}>{label}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

const MemoizedCustomNode = memo(CustomNode);

export default MemoizedCustomNode;
