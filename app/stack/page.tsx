import React from 'react'

const technologies = [
  { name: 'React + TypeScript', description: 'Typed, component-based user interfaces.' },
  { name: 'Next.js', description: 'Full-stack React applications with server rendering.' },
  { name: 'Node.js', description: 'Backend services and APIs with JavaScript.' },
  { name: 'React Native', description: 'Cross-platform mobile applications.' },
  { name: 'C#', description: 'Applications and backend services with .NET.' },
  { name: 'C', description: 'Low-level programming and systems development.' },
  { name: 'C++', description: 'High-performance software and systems.' },
  { name: 'Python', description: 'Automation, scripting and data processing.' },
  { name: 'JavaScript', description: 'Interactive websites and web applications.' },
  { name: 'TypeScript', description: 'Static typing for JavaScript applications.' },
  { name: 'SQL', description: 'Querying and managing relational databases.' },
  { name: 'MongoDB', description: 'Flexible, document-based data storage.' },
  { name: 'Docker', description: 'Container management and orchestration.' },
  { name: 'AWS', description: 'Experience of running EC2 virtual machines, Aurora database, Lambda functions .etc' },
]

const Stack = () => {
  return (
    <section
      aria-labelledby="stack-heading"
      className="bg-background px-6 py-16 text-foreground"
    >
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Technologies
            </p>
            <h2
              id="stack-heading"
              className="text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              My Tech Stack
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Languages, frameworks and databases for web, mobile and backend
              development.
            </p>
          </div>

          <div className="rounded-lg flex">
            <img
              src="/taltech.png"
              alt="TalTech — Tallinn University of Technology"
              className="h-15 w-auto max-w-full"
            />
            <img
              src="/step-it.png"
              alt="TalTech — Tallinn University of Technology"
              className="h-15 w-auto max-w-full"
            />
          </div>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {technologies.map(({ name, description }) => (
            <article
              key={name}
              className="rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm transition-colors hover:bg-accent"
            >
              <h3 className="mb-2 text-lg font-semibold">{name}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Stack