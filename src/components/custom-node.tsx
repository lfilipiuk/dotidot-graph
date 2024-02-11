import { Handle, NodeProps, NodeToolbar, Position } from "reactflow";
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
    <Card style={containerStyle} className={"w-48 relative"}>
      <Handle type="target" position={Position.Left} />
      <div className="flex items-center py-2 px-3 justify-center">
        <HoverCard
        openDelay={100}
        closeDelay={0}
        >
          <HoverCardTrigger className="flex items-center font-bold">
            {label}
          </HoverCardTrigger>
          <NodeToolbar isVisible={true}>
            <HoverCardContent>
              <div className="text-sm"> {JSON.stringify(allData, null, 2)}</div>
            </HoverCardContent>
          </NodeToolbar>
        </HoverCard>
      </div>
      <Handle type="source" position={Position.Right} />
    </Card>
  );
};

export default memo(CustomNode);
