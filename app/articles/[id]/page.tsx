import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CalendarDays, Clock } from "lucide-react";
import { notFound } from "next/navigation";

import { getById, TypedResult } from "@/api/api";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type ArticlePageProps = {
  params: Promise<{
    id: string;
  }>;
};


type ArticleData = {
  _id: string;
  title: string;
  description: string;
  content: string;
  readingTime: number;
  createdAt: string;
  updatedAt: string;
};


type ArticleResponse = {
  isSuccess: boolean;
  message: string;
  data?: ArticleData;
};

export const dynamic = "force-dynamic";

export default async function ArticlePage({
  params,
}: ArticlePageProps) {
  const { id } = await params;

  let article: TypedResult<ArticleData>;

  try {
    article = await getById(id);
  } catch (error: unknown) {
    if (
      axios.isAxiosError(error) &&
      (error.response?.status === 404 || error.response?.status === 400)
    ) {
      notFound();
    }

    throw error;
  }

  if (!article || !article.data._id) {
    notFound();
  }

  const createdAt = new Date(article.data.createdAt);

  const formattedDate = Number.isNaN(createdAt.getTime())
    ? "Date unavailable"
    : createdAt.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-10">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/home">Home</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>{article.data.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* article.data header */}
      <header className="mb-10 border-b border-border pb-8">
        <h1 className="wrap-break-words text-4xl font-bold tracking-tight">
          {article.data.title}
        </h1>

        {article.data.description && (
          <p className="mt-4 text-lg leading-7 text-muted-foreground">
            {article.data.description}
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalendarDays className="size-4" aria-hidden="true" />
            <span>{formattedDate}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="size-4" aria-hidden="true" />
            <span>{article.data.readingTime} min read</span>
          </div>
        </div>
      </header>

      {/* Markdown */}
      <article className="max-w-none wrap-break-words">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="mb-6 mt-10 text-4xl font-bold tracking-tight">
                {children}
              </h1>
            ),

            h2: ({ children }) => (
              <h2 className="mb-4 mt-8 text-3xl font-semibold tracking-tight">
                {children}
              </h2>
            ),

            h3: ({ children }) => (
              <h3 className="mb-3 mt-6 text-2xl font-semibold">
                {children}
              </h3>
            ),

            p: ({ children }) => (
              <p className="mb-5 text-base leading-8 text-muted-foreground">
                {children}
              </p>
            ),

            ul: ({ children }) => (
              <ul className="mb-5 ml-6 list-disc space-y-2">
                {children}
              </ul>
            ),

            ol: ({ children }) => (
              <ol className="mb-5 ml-6 list-decimal space-y-2">
                {children}
              </ol>
            ),

            blockquote: ({ children }) => (
              <blockquote className="my-6 border-l-4 border-border pl-4 italic text-muted-foreground">
                {children}
              </blockquote>
            ),

            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline underline-offset-4 hover:text-blue-300"
              >
                {children}
              </a>
            ),

            img: ({ src, alt }) => (
              <img
                src={src}
                alt={alt ?? ""}
                className="my-8 w-full rounded-xl border border-border"
              />
            ),

            pre: ({ children }) => (
              <pre className="my-6 overflow-x-auto rounded-lg border border-border bg-muted p-4 [&>code]:bg-transparent [&>code]:p-0">
                {children}
              </pre>
            ),

            code: ({ className, children }) => (
              <code
                className={`rounded bg-muted px-1.5 py-0.5 font-mono text-sm ${className ?? ""
                  }`}
              >
                {children}
              </code>
            ),

            table: ({ children }) => (
              <div className="my-6 overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  {children}
                </table>
              </div>
            ),

            th: ({ children }) => (
              <th className="border border-border bg-muted px-4 py-2 font-semibold">
                {children}
              </th>
            ),

            td: ({ children }) => (
              <td className="border border-border px-4 py-2">
                {children}
              </td>
            ),
          }}
        >
          {article.data.content}
        </ReactMarkdown>
      </article>
    </main>
  );
}