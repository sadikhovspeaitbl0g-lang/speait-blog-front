import React from 'react'

const About = () => {
  return (
    <div className="flex flex-col items-center px-6 py-10 text-center">
      <h1 className="mb-6 text-3xl font-bold">About</h1>

      <div className="max-w-2xl space-y-5 text-muted-foreground">
        <p className="leading-relaxed">
          My name is Yunus Sadikhov, and I am a student at TalTech University.
          Although I have previous experience in web and mobile development, I
          am particularly passionate about cybersecurity and understanding the
          security principles behind the code. At the same time, I am eager to
          deepen my knowledge of computer networking.
        </p>

        <p className="leading-relaxed">
          I created this blog to share my articles, research, projects, and
          papers as I continue to explore cybersecurity, networking, and
          software development.
        </p>
      </div>

      <h3 className="mt-8 text-lg font-semibold">
        Yunus Sadikhov
      </h3>
    </div>
  )
}

export default About