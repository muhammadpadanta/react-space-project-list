
const placeholderCode = `
function animateConstellation(nodes, links) {
  const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id))
    .force("charge", d3.forceManyBody().strength(-500))
    .force("center", d3.forceCenter(width / 2, height / 2));

  // ... additional simulation logic
}
`.trim();

export const graphData = {
    nodes: [
        { id: "p1", group: "frontend", label: "E-Commerce", radius: 70, data: { title: "E-Commerce Platform", description: "A full-stack e-commerce solution with a modern frontend, leveraging a headless CMS for content and Stripe for secure payment processing. This description is intentionally made longer to demonstrate the scrolling functionality of the side panel. When the content overflows its container, a scrollbar should appear, allowing the user to view all the information without expanding the panel itself. The buttons below should remain fixed in place.", technologies: ["Next.js", "React", "Strapi", "Stripe", "PostgreSQL"], liveUrl: "#", repoUrl: "#" } },
        { id: "p2", group: "data-vis", label: "Data Viz", radius: 60, data: { title: "Data Visualizer", description: "An interactive dashboard for visualizing financial data using D3.js. Features include dynamic charts, tooltips, and responsive design.", technologies: ["D3.js", "Vanilla JS", "HTML5", "CSS3"], liveUrl: "#", repoUrl: "" } },
        { id: "p3", group: "frontend", label: "Terminal", radius: 65, data: { title: "Terminal Portfolio", description: "A lightweight, text-based portfolio interface built with React. It simulates a command-line environment for a unique user experience.", technologies: ["React", "Styled-Components", "TypeScript"], liveUrl: "#", repoUrl: "#" } },
        { id: "p4", group: "mobile", label: "Weather App", radius: 65, data: { title: "Mobile Weather App", description: "A cross-platform mobile application developed with React Native. It fetches data from a third-party weather API to provide real-time forecasts.", technologies: ["React Native", "Expo", "API"], liveUrl: "", repoUrl: "#" } },
        { id: "p5", group: "backend", label: "Task API", radius: 60, data: { title: "Task Management API", description: "A secure and efficient RESTful API for task management, built with a serverless architecture on AWS for scalability and cost-effectiveness.", technologies: ["Node.js", "AWS Lambda", "DynamoDB", "Serverless"], liveUrl: "", repoUrl: "#" } }
    ],
    links: [{ source: "p1", target: "p3" }, { source: "p1", target: "p5" }, { source: "p4", target: "p3" }]
};

graphData.nodes.forEach(node => {
    if (node.data) {
        node.data.code = placeholderCode;
    }
});