import { Handle, NodeProps, Position } from "reactflow";
import { FC, memo } from "react";
import { Card } from "@/components/ui/card.tsx";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card.tsx";

const CustomNode: FC<NodeProps> = (props: NodeProps) => {
  const {
    data: { label, borderColor },
  } = props;

  const allData = props.data;

  const containerStyle = {
    border: `2px solid ${borderColor}`,
  };
  return (
    <Card style={containerStyle} className={"relative z-20"}>
      <div className="flex items-center py-2 px-3">
        <Handle type="target" position={Position.Left} />
        <HoverCard>
          <HoverCardTrigger className="flex items-center font-bold">
            {label}
          </HoverCardTrigger>
          <HoverCardContent className={"z-50"}>
            <div className="text-sm"> {JSON.stringify(allData, null, 2)}</div>
          </HoverCardContent>
        </HoverCard>

        <Handle type="source" position={Position.Right} />
      </div>
    </Card>
  );
};

export default memo(CustomNode);
