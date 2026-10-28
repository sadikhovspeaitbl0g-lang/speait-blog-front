import React from 'react'

const projects = [
  {
    id: 1,
    title: "Shah Marketplace",
    description:
      "My first major project, built as coursework at STEP IT Academy. It received 12/12 points for both backend architecture and frontend design and feature implementation.",
    technologies: [
      "React",
      "TypeScript",
      "C#",
      "ASP.NET",
      "MinIO",
      "Docker",
      "Microsoft SQL Server",
    ],
    status: "Completed",
  },
  {
    id: 2,
    title: "Apple News",
    description:
      "A news application built with React and TypeScript, using a free news API to fetch articles and Microsoft SQL Server to store user data.",
    technologies: ["React", "TypeScript", "News API", "Microsoft SQL Server"],
    status: "Completed",
  },
  {
    id: 3,
    title: "Furniture Marketplace",
    description:
      "A marketplace for trading furniture and buying new pieces, developed by me, Fakhri Farajov, together with a team.",
    technologies: [
      "React",
      "TypeScript",
      "C#",
      "ASP.NET",
      "MinIO",
      "Libre Server",
      "Microsoft SQL Server",
    ],
    status: "Completed",
  },
  {
    id: 4,
    title: "NIDA",
    description:
      "An ongoing travel discovery project inspired by TripAdvisor, combining web and mobile applications with artificial intelligence features.",
    technologies: [
      "React",
      "TypeScript",
      "React Native",
      "C#",
      "ASP.NET",
      "Artificial Intelligence",
      "Microsoft SQL Server",
      "Docker",
    ],
    status: "In progress",
  },
];

const Projects = () => {
  return (
    <section
      aria-labelledby="projects-title"
      className="bg-background px-6 py-20 text-foreground sm:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-primary"
            />
            Selected work
          </div>

          <h1
            id="projects-title"
            className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl"
          >
            Built with purpose.
            <span className="mt-2 block text-muted-foreground">
              Crafted with care.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground">
            From my first marketplace to AI-powered travel experiences,
            each project represents a new challenge and something learned.
          </p>
        </header>

        <div className="grid gap-5 md:grid-cols-2">
          {projects.map((project, index) => {
            const inProgress = project.status === "In progress";

            return (
              <article
                key={project.id}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card p-7 text-card-foreground shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg motion-reduce:transform-none motion-reduce:transition-none sm:p-9"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
                />

                <div className="mb-9 flex items-center justify-between gap-4">
                  <span className="font-mono text-xs text-muted-foreground">
                    PROJECT / {String(index + 1).padStart(2, "0")}
                  </span>

                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${
                      inProgress
                        ? "border-primary/20 bg-primary/10 text-primary"
                        : "border-border bg-secondary text-secondary-foreground"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`h-1.5 w-1.5 rounded-full ${
                        inProgress
                          ? "bg-primary"
                          : "bg-muted-foreground"
                      }`}
                    />
                    {project.status}
                  </span>
                </div>

                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  {project.title}
                </h2>

                <p className="mb-8 mt-4 text-sm leading-7 text-muted-foreground">
                  {project.description}
                </p>

                {project.technologies.length > 0 && (
                  <div className="mt-auto border-t border-border pt-6">
                    <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Built with
                    </p>

                    <ul
                      aria-label={`${project.title} technologies`}
                      className="flex flex-wrap gap-2"
                    >
                      {project.technologies.map((technology) => (
                        <li
                          key={technology}
                          className="rounded-md border border-border bg-muted/50 px-2.5 py-1 text-xs leading-5 text-card-foreground"
                        >
                          {technology}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        <footer className="mt-8 flex flex-col gap-4 rounded-xl border border-border bg-muted/40 p-6 sm:flex-row sm:items-center sm:gap-6 sm:p-8">
          <span className="text-4xl font-semibold tracking-tight">
            ~15
          </span>

          <div>
            <p className="font-medium">Smaller projects, more exploration.</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Experimenting with new ideas and sharpening my development
              skills along the way.
            </p>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default Projects;