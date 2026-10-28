"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LockKeyhole, Search, UserRound } from "lucide-react";

import { ModeToggle } from "@/components/theme-toggle";

type NavbarData = {
  categories: {
    id: string;
    label: string;
    href: string;
  }[];
  searchHref: string;
  createAction?: {
    href: string;
    label: string;
    badge?: string;
  };
  user?: {
    name: string;
    profileHref: string;
    avatarUrl?: string;
  };
};

export default function Navbar() {
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);

  const [data, setData] = useState<NavbarData | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadNavbar() {
      try {
        const response = await fetch("/api/navbar", {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load navbar");
        }

        const result: NavbarData = await response.json();

        if (!controller.signal.aborted) {
          setData(result);
        }
      } catch {
        // Search remains available if navbar data fails to load.
      }
    }

    void loadNavbar();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (
        !event.repeat &&
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams();
    const value = query.trim();

    if (value) {
      params.set("q", value);
    }

    const queryString = params.toString();

    // A new search starts on page 1.
    router.push(queryString ? `/home?${queryString}` : "/");
  }

  return (
    <header className="w-full min-w-0 border-b border-border bg-background text-foreground">
      <div className="flex min-w-0 flex-wrap items-center gap-4 px-4 py-4 sm:px-6">
        <form
          role="search"
          onSubmit={handleSearch}
          className="order-2 flex w-full min-w-0 items-center gap-3 rounded-xl bg-muted px-4 py-3 focus-within:ring-2 focus-within:ring-ring lg:order-none lg:w-auto lg:flex-1 lg:basis-64"
        >
          <button
            type="submit"
            aria-label="Search articles"
            className="shrink-0 rounded focus-visible:outline-2 focus-visible:outline-ring"
          >
            <Search
              className="size-5 text-muted-foreground"
              aria-hidden="true"
            />
          </button>

          <input
            ref={searchRef}
            type="search"
            name="q"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search articles..."
            aria-label="Search articles"
            className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />

          <button
            type="button"
            onClick={() => searchRef.current?.focus()}
            aria-label="Focus search"
            className="hidden shrink-0 rounded bg-background px-2 py-1 text-muted-foreground focus-visible:outline-2 focus-visible:outline-ring sm:inline-flex"
          >
            <kbd className="font-mono text-xs">⌘ / Ctrl K</kbd>
          </button>
        </form>

        {data && data.categories.length > 0 && (
          <nav
            aria-label="Article categories"
            className="order-3 flex w-full min-w-0 flex-wrap gap-2 lg:order-none lg:w-auto lg:flex-1"
          >
            {data.categories.map((category) => (
              <Link
                key={category.id}
                href={category.href}
                className="max-w-full rounded-lg px-3 py-2 text-sm font-semibold break-words text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-ring"
              >
                {category.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="ml-auto flex max-w-full flex-wrap items-center justify-end gap-3">
          {data?.createAction && (
            <Link
              href={data.createAction.href}
              className="inline-flex max-w-full items-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-ring"
            >
              <LockKeyhole className="size-4 shrink-0" aria-hidden="true" />

              <span className="min-w-0 wrap-break-words">
                {data.createAction.label}
              </span>

              {data.createAction.badge && (
                <span className="hidden rounded bg-primary-foreground/15 px-2 py-1 font-mono text-xs sm:inline">
                  {data.createAction.badge}
                </span>
              )}
            </Link>
          )}

          {data?.user && (
            <Link
              href={data.user.profileHref}
              aria-label={data.user.name}
              className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted text-muted-foreground hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
            >
              {data.user.avatarUrl ? (
                <img
                  src={data.user.avatarUrl}
                  alt=""
                  width={40}
                  height={40}
                  className="size-full object-cover"
                />
              ) : (
                <UserRound className="size-5" aria-hidden="true" />
              )}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}