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
import {NodeType, VariableType} from "@/variable-map/enums.ts";

interface IconProps {
  type: NodeType;
  showValueType?: VariableType;
}

const valueTypeIcons = {
  text: (
    <div className="w-5 h-5 font-mono font-normal text-sm leading-5 text-center">
      Aa
    </div>
  ),
  number: (
    <div className="w-5 h-5 font-mono font-normal text-sm leading-5 text-center">
      01
    </div>
  ),
  date: <CalendarDays strokeWidth={1.25} className="w-5 h-5 text-center" />,
  array: (
    <div className="w-5 h-5 font-mono font-normal text-sm leading-5 text-center">
      []
    </div>
  ),
  image: <Image strokeWidth={1.25} className="w-5 h-5 text-center" />,
};

const nodeTypeIcons = {
  [NodeType.AdditionalSource]: (
    <Database strokeWidth={1.25} className="w-5 text-center" />
  ),
  [NodeType.Campaign]: (
    <Megaphone strokeWidth={1.25} className="w-5 h-5 text-center" />
  ),
  [NodeType.FeedExport]: (
    <ExternalLink strokeWidth={1.25} className="w-5 h-5 text-center" />
  ),
  [NodeType.KeywordSetting]: (
    <Key strokeWidth={1.25} className="w-5 h-5 text-center" />
  ),
  [NodeType.AdwordsSetting]: (
    <Presentation strokeWidth={1.25} className="w-5 h-5 text-center" />
  ),
  [NodeType.BaseAdtext]: (
    <div className="w-5 h-5 font-mono font-normal text-xs leading-5 text-center">
      AD
    </div>
  ),
  [NodeType.BidRule]: (
    <Coins strokeWidth={1.25} className="w-5 h-5 text-center" />
  ),
  default: null,
};

const CustomNodeIcon = ({ type, showValueType }: IconProps) => {
  if (type === NodeType.Variable || type === NodeType.Modifier) {
    return valueTypeIcons[showValueType as VariableType] || null;
  }
  return nodeTypeIcons[type];
};

export default CustomNodeIcon;
