import { Handle, NodeProps, Position } from "reactflow";
import {FC, memo} from "react";
import { Card } from "@/components/ui/card.tsx";

const CustomNode: FC<NodeProps> = (props: NodeProps) => {
  const {
    data: { label, borderColor },
  } = props;

  const containerStyle = {
    border: `2px solid ${borderColor}`,
  };
  return (
    <Card style={containerStyle} className={"relative"}>
      <div className="flex items-center py-2 px-3">
        <Handle type="target" position={Position.Left} />
        <div>
          <div className="flex items-center font-bold">{label}</div>
        </div>

        <Handle type="source" position={Position.Right} />
      </div>
    </Card>
  );
};

export default memo(CustomNode);
