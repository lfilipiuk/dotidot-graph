import {
  CalendarDays,
  Coins,
  Database,
  ExternalLink,
  Image,
  Key,
  Megaphone,
  Presentation,
} from "lucide-react";
import { NodeType } from "@/graph/types.ts";

interface IconProps {
  type: NodeType;
  showValueType?: "text" | "number" | "date" | "array" | "image";
}

const CustomNodeIcon = ({ type, showValueType }: IconProps) => {
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

export default CustomNodeIcon;
