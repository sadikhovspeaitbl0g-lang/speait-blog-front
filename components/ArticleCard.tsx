import React from 'react'
import { CalendarDays, Clock } from 'lucide-react'

interface ArticleCard{
    title:string,
    description: string,
    date: string,
    readingTime: number

}

const ArticleCard = ({ title, description, date, readingTime }: ArticleCard) => {
  return (
    <article className="border-b border-sidebar-border py-7">
      <h2 className="text-2xl font-medium text-blue-400 hover:text-blue-300">
        {title}
      </h2>

      <p className="mt-3 text-base leading-8 text-muted-foreground">
        {description}
      </p>

      <div className="mt-5 flex items-center gap-5 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4" />
          <span>{date}</span>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="size-4" />
          <span>{readingTime} min</span>
        </div>
      </div>
    </article>
  )
}

export default ArticleCard