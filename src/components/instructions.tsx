import React, {memo} from "react";

const Instructions: React.FC = () => {
  return (
    <div className={"md:text-sm text-xs"}>
      <p className="md:text-lg text-sm font-bold text-gray-800 mb-2">
        Explore Connections:
      </p>
      <ol className="list-disc pl-4 space-y-2">
        <li>
          <strong>Click on a Node:</strong> To explore, simply click on any node
          in the map. This will highlight the node and reveal lines connecting
          it to related nodes, showing you how variables are interconnected.
        </li>
        <li>
          <strong>View Connections:</strong> With a node selected, you'll see
          its direct connections. This allows you to understand the
          relationships between different variables at a glance.
        </li>
      </ol>
      <p className="md:text-lg text-sm font-bold text-gray-800 my-2">
        Clear Selection:
      </p>
      <ul className="list-disc pl-4 space-y-2">
        <li>
          <strong>Click on an Empty Area:</strong> To clear your current
          selection and remove the highlight from any selected node, click
          anywhere on the empty area of the map. This resets your view, allowing
          you to start a new exploration.
        </li>
      </ul>
      <p className="md:text-lg text-sm font-bold text-gray-800 my-2">
        Tips for Navigation:
      </p>
      <ul className="list-disc pl-4 space-y-2">
        <li>
          Zoom in or out as needed to view nodes in detail or to get a broader
          overview of the map.
        </li>
        <li>
          Pan around the map by clicking and dragging. This allows you to move.
        </li>
      </ul>
      <p className="md:text-lg text-sm font-bold text-gray-800 my-2">
        Need Help?
      </p>
      <p className="mb-4">
        For more detailed instructions or assistance, please refer
        documentation.
      </p>
    </div>
  );
};

const MemoizedInstructions = memo(Instructions);

export default MemoizedInstructions;
