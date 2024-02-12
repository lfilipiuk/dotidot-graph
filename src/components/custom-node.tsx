import { FC, memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import { cn } from "@/lib/utils.ts";
import CustomNodeIcon from "@/components/custom-node-icon.tsx";
import { NodeType } from "@/graph/types.ts";
interface ColorProps {
  border: string;
  background: string;
}

const colorMapping: Record<NodeType, ColorProps> = {
  [NodeType.Variable]: { border: "#1E90FF", background: "#AFEEEE" },
  [NodeType.Modifier]: { border: "#32CD32", background: "#98FB98" },
  [NodeType.AdditionalSource]: { border: "#FFD700", background: "#FFFACD" },
  [NodeType.Campaign]: { border: "#FF4500", background: "#FFA07A" },
  [NodeType.FeedExport]: { border: "#DB7093", background: "#FFC0CB" },
  [NodeType.KeywordSetting]: { border: "#6A5ACD", background: "#E6E6FA" },
  [NodeType.AdwordsSetting]: { border: "#20B2AA", background: "#AFEEEE" },
  [NodeType.BaseAdtext]: { border: "#BDB76B", background: "#F5F5DC" },
  [NodeType.BidRule]: { border: "#C71585", background: "#FFB6C1" },
  [NodeType.Default]: { border: "#808080", background: "#D3D3D3" },
};

interface CustomNodeData {
  label: string;
  type: NodeType;
  showValueType: "number" | "text" | "date" | "array" | "image";
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
      className={cn("min-w-60 relative rounded-lg bg-white border-2")}
    >
      <Handle type="target" position={Position.Left} />
      <div className="flex items-center py-2 px-3">
        <div className={"gap-2 flex items-center"}>
          <div
            style={{
              backgroundColor: backgroundColor,
            }}
            className={cn(
              backgroundColor,
              "flex w-8 h-8 rounded-full items-center justify-center",
            )}
          >
            {icon}
          </div>
          <div className={"font-semibold"}>{label}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default memo(CustomNode);
