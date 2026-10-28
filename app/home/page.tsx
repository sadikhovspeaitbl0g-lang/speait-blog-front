"use client";

import { Suspense, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import ArticleCard from "@/components/ArticleCard";
import { getPaginated } from "@/api/api";

type Article = {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  readingTime: number;
};

type PaginatedResponse = {
  isSuccess: boolean;
  data: Article[];
  page: number;
  pageSize: number;
  totalArticles: number;
  totalPages: number;
};

const ARTICLES_PER_PAGE = 4;

function Loader({ message = "Loading articles..." }: { message?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-64 items-center justify-center gap-3"
    >
      <span
        aria-hidden="true"
        className="size-8 animate-spin rounded-full border-4 border-muted border-t-blue-400 motion-reduce:animate-none"
      />
      <span className="text-sm text-muted-foreground">{message}</span>
    </div>
  );
}

function formatDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isNavigating, startNavigation] = useTransition();

  const search = searchParams.get("q")?.trim() ?? "";
  const currentPage = Math.max(
    1,
    parseInt(searchParams.get("page") ?? "1", 10) || 1
  );

  const [articles, setArticles] = useState<Article[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;

    async function fetchArticles() {
      setIsLoading(true);
      setError("");

      try {
        let response: PaginatedResponse = await getPaginated(
          currentPage,
          ARTICLES_PER_PAGE,
          search
        );

        if (!active) return;

        if (!response.isSuccess) {
          throw new Error("Failed to load articles.");
        }

        const lastPage = Math.max(1, response.totalPages);

        if (currentPage > lastPage) {
          response = await getPaginated(
            lastPage,
            ARTICLES_PER_PAGE,
            search
          );

          if (!active) return;

          if (!response.isSuccess) {
            throw new Error("Failed to load articles.");
          }

          const params = new URLSearchParams();

          if (search) {
            params.set("q", search);
          }

          params.set("page", String(lastPage));

          router.replace(`/home?${params.toString()}`, {
            scroll: false,
          });
        }

        setArticles(response.data);
        setTotalPages(response.totalPages);
      } catch {
        if (!active) return;

        setError("Failed to load articles. Please try again.");
        setArticles([]);
        setTotalPages(0);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void fetchArticles();

    return () => {
      active = false;
    };
  }, [currentPage, search, retryCount, router]);

  function goToPage(page: number) {
    if (
      isLoading ||
      isNavigating ||
      page < 1 ||
      page > totalPages ||
      page === currentPage
    ) {
      return;
    }

    setIsLoading(true);
    setError("");

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));

    router.push(`/home?${params.toString()}`, {
      scroll: false,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <div className="px-6 py-7">
      {isNavigating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm">
          <Loader message="Loading article..." />
        </div>
      )}

      <div className="mb-2 text-sm text-muted-foreground">
        {search ? `Search results for "${search}"` : "Home"}
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <div role="alert" className="py-8">
          <p className="text-sm text-red-500">{error}</p>

          <button
            type="button"
            onClick={() => {
              setIsLoading(true);
              setRetryCount((count) => count + 1);
            }}
            className="mt-4 rounded-md border border-sidebar-border px-4 py-2 text-sm hover:bg-sidebar-accent"
          >
            Try again
          </button>
        </div>
      ) : articles.length === 0 ? (
        <p className="py-8 text-sm text-muted-foreground">
          {search
            ? "No articles match your search."
            : "No articles published yet."}
        </p>
      ) : (
        <div>
          {articles.map((article) => (
            <Link
              key={article._id}
              href={`/articles/${article._id}`}
              className="block"
              onClick={(event) => {
                // Preserve opening links in a new tab or window.
                if (
                  event.defaultPrevented ||
                  event.button !== 0 ||
                  event.metaKey ||
                  event.ctrlKey ||
                  event.shiftKey ||
                  event.altKey
                ) {
                  return;
                }

                event.preventDefault();

                if (isNavigating) return;

                startNavigation(() => {
                  router.push(`/articles/${article._id}`);
                });
              }}
            >
              <ArticleCard
                title={article.title}
                description={article.description}
                date={formatDate(article.createdAt)}
                readingTime={article.readingTime}
              />
            </Link>
          ))}
        </div>
      )}

      {!isLoading && !error && totalPages > 1 && (
        <nav
          aria-label="Article pagination"
          className="mt-8 flex flex-wrap items-center justify-center gap-2"
        >
          <button
            type="button"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1 || isNavigating}
            className="rounded-md border border-sidebar-border px-4 py-2 text-sm hover:bg-sidebar-accent disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, index) => {
            const page = index + 1;

            return (
              <button
                key={page}
                type="button"
                onClick={() => goToPage(page)}
                disabled={isNavigating}
                aria-current={currentPage === page ? "page" : undefined}
                aria-label={`Page ${page}`}
                className={`size-9 rounded-md border text-sm disabled:cursor-not-allowed disabled:opacity-40 ${
                  currentPage === page
                    ? "border-blue-400 bg-blue-400 text-white"
                    : "border-sidebar-border hover:bg-sidebar-accent"
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages || isNavigating}
            className="rounded-md border border-sidebar-border px-4 py-2 text-sm hover:bg-sidebar-accent disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </nav>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="px-6 py-7">
          <Loader />
        </div>
      }
    >
      <Home />
    </Suspense>
  );
}