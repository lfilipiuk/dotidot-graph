export function generateLayout(nodes, edges) {
    console.log('edges', edges);
    console.log('json edges', JSON.stringify(edges));

    // Column definitions
    const columns = {
        "DataSourceVariable": { x: 100, startY: 50, gap: 100 },
        "AdditionalSource": { x: 300, startY: 50, gap: 100 },
        "CampaignSetting": { x: 500, startY: 50, gap: 100 },
        "Other": { x: 700, startY: 50, gap: 100 },
        "Adjusted": { x: 900, startY: 50, gap: 100 } // Additional column for adjusted nodes
    };

    // Track the current Y position for each column
    const currentPosition = {
        "DataSourceVariable": columns.DataSourceVariable.startY,
        "AdditionalSource": columns.AdditionalSource.startY,
        "CampaignSetting": columns.CampaignSetting.startY,
        "Other": columns.Other.startY,
        "Adjusted": columns.Adjusted.startY
    };

    // Identify target nodes from edges
    const targetNodes = new Set(edges.map(edge => edge.target));

    // Function to assign position based on type and edges
    function assignPosition(node) {
        const typeName = node.data.__typename;
        let columnKey = targetNodes.has(node.id) ? "Adjusted" : "Other"; // Default to "Other" or "Adjusted" if it's a target node

        if (columns[typeName]) { // If the node type has a specific column
            columnKey = typeName;
        }

        // If the node is a target node and has a specific column, adjust its position
        if (targetNodes.has(node.id) && columns[typeName]) {
            node.position = {
                x: columns[columnKey].x + 200, // Move target nodes 200px to the right for visibility
                y: currentPosition[columnKey]
            };
        } else {
            // Set the position normally for non-target nodes or nodes in the "Other" category
            node.position = {
                x: columns[columnKey].x,
                y: currentPosition[columnKey]
            };
        }

        // Update the current Y position for the next node in this column
        currentPosition[columnKey] += columns[columnKey].gap;
    }

    // Loop through each node and assign positions
    nodes.forEach(assignPosition);

    return nodes;
}