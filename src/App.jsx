import React from "react";

export default function HomePage() {
  const projects = [
    {
      id: 1,
      title: "Todo App",
      description: "A simple todo list app with React and localStorage.",
      link: "/todo",
    },
    {
      id: 2,
      title: "Counter App",
      description: "Check real-time weather data using an API.",
      link: "/Counter",
    },
    {
      id: 3,
      title: "Portfolio Website",
      description: "My personal portfolio with animations and responsive design.",
      link: "/projects/portfolio",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "#e2e8f0",
        fontFamily: "system-ui, sans-serif",
        padding: "40px 20px",
      }}
    >
      <header
        style={{
          maxWidth: "800px",
          margin: "0 auto 40px auto",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "36px", marginBottom: "10px" }}>🚀 My Projects Blog</h1>
        <p style={{ fontSize: "18px", color: "#94a3b8" }}>
          Welcome! Here you can explore my projects and experiments.
        </p>
      </header>

      <main
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          display: "grid",
          gap: "20px",
        }}
      >
        {projects.map((project) => (
          <article
            key={project.id}
            style={{
              padding: "20px",
              borderRadius: "12px",
              background: "#111827",
              border: "1px solid #1f2937",
              transition: "transform 0.2s ease",
            }}
          >
            <h2 style={{ margin: "0 0 8px 0", fontSize: "24px" }}>
              <a
                href={project.link}
                style={{
                  color: "#38bdf8",
                  textDecoration: "none",
                }}
              >
                {project.title}
              </a>
            </h2>
            <p style={{ margin: 0, color: "#cbd5e1" }}>{project.description}</p>
          </article>
        ))}
      </main>

      <footer
        style={{
          maxWidth: "800px",
          margin: "40px auto 0 auto",
          textAlign: "center",
          fontSize: "14px",
          color: "#94a3b8",
        }}
      >
        © {new Date().getFullYear()} Pouria — Built with React ⚛️
      </footer>
    </div>
  );
}
