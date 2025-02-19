import { useState, useEffect } from "react";
import * as d3 from "d3";
import "./App.css";

const initialData = {
  name: "Business",
  children: [
    { name: "Department A", value: 95 },
    { name: "Department B", value: 87 },
    {
      name: "Department C",
      children: [
        { name: "Team C1", value: 92 },
        { name: "Team C2", value: 78 },
      ],
    },
  ],
};

export default function App() {
  const [data, setData] = useState(initialData);
  const [threshold, setThreshold] = useState(90);

  // Use green for above threshold, red for below threshold
  const getColor = (value) => {
    const difference = value - threshold;  // Calculate the difference from the threshold

    let r, g, b;

    if (difference > 0) {
      // If the value is above the threshold, color towards green
      r = 0; // Red stays at 0 for greenish color
      g = Math.round(255 * (difference / (100 - threshold))); // Gradually increase green
      b = 0; // Blue stays at 0
    } else {
      // If the value is below the threshold, color towards red
      r = Math.round(255 * (-difference / threshold)); // Gradually increase red
      g = 0; // Green stays at 0
      b = 0; // Blue stays at 0
    }

    return `rgb(${r}, ${g}, ${b})`;
  };

  useEffect(() => {
    const width = 900;
    const height = 600;

    const svg = d3
      .select("#tree-container")
      .html("")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(50,50)");

    const root = d3.hierarchy(data);
    const treeLayout = d3.tree().size([width - 100, height - 150]);
    treeLayout(root);

    // Create the lines (no transitions here)
    svg
      .selectAll("path")
      .data(root.links())
      .enter()
      .append("path")
      .attr("d", d3.linkVertical()
        .x((d) => d.x)
        .y((d) => d.y))
      .attr("fill", "none")
      .attr("stroke", "#ddd") // Lighter line color
      .attr("stroke-width", 1.5);

    // Create the nodes with modern ShadCN-inspired design
    svg
      .selectAll("foreignObject")
      .data(root.descendants())
      .enter()
      .append("foreignObject")
      .attr("x", (d) => d.x - 70)
      .attr("y", (d) => d.y - 35)
      .attr("width", 140)
      .attr("height", 70)
      .append("xhtml:div")
      .style("width", "140px")
      .style("height", "70px")
      .style("border-radius", "16px") // Rounded corners for modern look
      .style("background-color", (d) => getColor(d.data.value || 90)) // Use dynamic color
      .style("display", "flex")
      .style("align-items", "center")
      .style("justify-content", "center")
      .style("box-shadow", "0px 8px 16px rgba(0, 0, 0, 0.1)") // Softer, bigger shadow
      .style("color", "#fff")
      .style("font-family", "'Inter', sans-serif") // Modern font
      .style("font-weight", "600")
      .style("font-size", "16px")
      .style("text-align", "center")
      .style("transition", "background-color 0.3s ease-in-out") // Smooth background color change
      .text((d) => `${d.data.name}\n${d.data.value || "N/A"}`);

  }, [data, threshold]);

  return (
    <div className="container">
      <aside className="sidebar">
        <h3>Controls</h3>
        <label>Performance Threshold</label>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span>50</span>
          <input
            type="range"
            min="50"
            max="100"
            value={threshold}
            onChange={(e) => setThreshold(+e.target.value)}
          />
          <span>100</span>
        </div>
        <p>Current Threshold: {threshold}</p>
      </aside>
      <main className="tree-view" id="tree-container"></main>
    </div>
  );
}
