import React, { FC, memo } from "react";
import { Handle, NodeProps, NodeToolbar, Position } from "reactflow";

//TODO: Maybe remove this
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card.tsx";
import { cn } from "@/lib/utils.ts";
import {
  Image,
  CalendarDays,
  Database,
  Presentation,
  Megaphone,
  ExternalLink,
  Key,
  Coins,
} from "lucide-react";

enum NodeType {
  Variable = "variable",
  Modifier = "modifier",
  AdditionalSource = "additional-source",
  Campaign = "campaign",
  FeedExport = "feed-export",
  KeywordSetting = "keyword-setting",
  AdwordsSetting = "adwords-setting",
  BaseAdtext = "base-adtext",
  BidRule = "bid-rule",
  Default = "default",
}

interface CustomNodeData {
  __typename: string;
  id: string;
  label: string;
  showValueType?: "text" | "number" | "date" | "array" | "image";
}

const getNodeType = (data: CustomNodeData): NodeType => {
  if (
    data.__typename === "DataSourceVariable" &&
    data.id.includes("DataField")
  ) {
    return NodeType.Variable;
  } else if (
    data.__typename === "DataSourceVariable" &&
    data.id.includes("Modifier")
  ) {
    return NodeType.Modifier;
  } else if (data.__typename === "AdditionalSource") {
    return NodeType.AdditionalSource;
  } else if (data.__typename === "CampaignSetting") {
    return NodeType.Campaign;
  } else if (data.__typename === "FeedExport") {
    return NodeType.FeedExport;
  } else if (data.__typename === "KeywordSetting") {
    return NodeType.KeywordSetting;
  } else if (data.__typename === "AdwordsSetting") {
    return NodeType.AdwordsSetting;
  } else if (data.__typename === "BaseAdtext") {
    return NodeType.BaseAdtext;
  } else if (data.__typename === "BidRule") {
    return NodeType.BidRule;
  }
  return NodeType.Default;
};

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

interface IconProps {
  type: NodeType;
  showValueType?: "text" | "number" | "date" | "array" | "image";
}

const getIcon = ({ type, showValueType }: IconProps): JSX.Element | null => {
  switch (type) {
    case NodeType.Variable:
    case NodeType.Modifier:
      switch (showValueType) {
        case "text":
          return (
            <div className="w-5 h-5 font-mono font-normal text-sm leading-5 text-center">
              Aa
            </div>
          );
        case "number":
          return (
            <div className="w-5 h-5 font-mono font-normal text-sm leading-5 text-center">
              01
            </div>
          );
        case "date":
          return (
            <CalendarDays strokeWidth={1.25} className="w-5 h-5 text-center" />
          );
        case "array":
          return (
            <div className="w-5 h-5 font-mono font-normal text-sm leading-5 text-center">
              []
            </div>
          );
        case "image":
          return <Image strokeWidth={1.25} className="w-5 h-5 text-center" />;
        default:
          return null;
      }
    case NodeType.AdditionalSource:
      return <Database strokeWidth={1.25} className="w-5 text-center" />;
    case NodeType.Campaign:
      return <Megaphone strokeWidth={1.25} className="w-5 h-5 text-center" />;
    case NodeType.FeedExport:
      return (
        <ExternalLink strokeWidth={1.25} className="w-5 h-5 text-center" />
      );
    case NodeType.KeywordSetting:
      return <Key strokeWidth={1.25} className="w-5 h-5 text-center" />;
    case NodeType.AdwordsSetting:
      return (
        <Presentation strokeWidth={1.25} className="w-5 h-5 text-center" />
      );
    case NodeType.BaseAdtext:
      return (
        <div className="w-5 h-5 font-mono font-normal text-xs leading-5 text-center">
          AD
        </div>
      );
    case NodeType.BidRule:
      return <Coins strokeWidth={1.25} className="w-5 h-5 text-center" />;
    default:
      return null;
  }
};

const CustomNode: FC<NodeProps<CustomNodeData>> = ({ data }) => {
  const label = data.label;
  const type = getNodeType(data);
  const borderColor = colorMapping[type].border;
  const backgroundColor = colorMapping[type].background;
  const icon = getIcon({ type, showValueType: data.showValueType });

  return (
    <HoverCard openDelay={100} closeDelay={0}>
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

          <NodeToolbar isVisible={true}>
            <HoverCardContent>
              <div className="text-sm">
                {type}
                {backgroundColor}
                {JSON.stringify(data, null, 2)}
              </div>
            </HoverCardContent>
          </NodeToolbar>
        </div>
        <Handle type="source" position={Position.Right} />
      </div>
    </HoverCard>
  );
};

export default memo(CustomNode);
