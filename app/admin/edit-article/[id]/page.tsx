"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { updateArticle, checkCredentials, deleteArticle, getById } from "@/api/api";
import { toast } from "sonner";

const getToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const markdownPlaceholder = [
    "# Introduction",
    "",
    "Write your article here...",
    "",
    "## Exploitation",
    "",
    "You can use **bold**, *italic*, lists, links, and code:",
    "",
    "```c",
    "#include <stdio.h>",
    "",
    "int main() {",
    '    printf("Hello World");',
    "    return 0;",
    "}",
    "```",
].join("\n");

const getErrorMessage = (error: unknown, fallback: string) => {
    if (axios.isAxiosError<{ message?: string }>(error)) {
        return error.response?.data?.message || fallback;
    }

    return error instanceof Error ? error.message : fallback;
};

type Props = {
    onAuthenticated: () => void;
};

const ModalGetAdminCredentials = ({ onAuthenticated }: Props) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isChecking, setIsChecking] = useState(false);

    const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isChecking) return;

        setError("");
        setIsChecking(true);

        try {
            const result = await checkCredentials(username, password);

            if (result.isSuccess !== true) {
                setError("Invalid credentials");
                return;
            }

            setPassword("");
            onAuthenticated();
        } catch (error: unknown) {
            setError(
                getErrorMessage(error, "Unable to sign in. Please try again.")
            );
        } finally {
            setIsChecking(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <form
                onSubmit={handleLogin}
                className="w-full max-w-sm space-y-4 rounded-lg bg-background p-6"
            >
                <h2 className="text-xl font-bold">Admin login</h2>

                <fieldset disabled={isChecking} className="space-y-4">
                    <div>
                        <label htmlFor="admin-username" className="mb-2 block">
                            Username
                        </label>

                        <input
                            id="admin-username"
                            type="text"
                            autoComplete="username"
                            required
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            className="w-full rounded border bg-background px-3 py-2"
                        />
                    </div>

                    <div>
                        <label htmlFor="admin-password" className="mb-2 block">
                            Password
                        </label>

                        <input
                            id="admin-password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            className="w-full rounded border bg-background px-3 py-2"
                        />
                    </div>

                    {error && (
                        <p role="alert" className="text-sm text-red-500">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
                    >
                        {isChecking ? "Checking..." : "Sign in"}
                    </button>
                </fieldset>
            </form>
        </div>
    );
};

const UpdateArticle = () => {
    const { id } = useParams<{ id: string }>();

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [loadedId, setLoadedId] = useState<string | null>(null);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");
    const [readingTime, setReadingTime] = useState(1);
    const [date, setDate] = useState(getToday);

    const [isPublishing, setIsPublishing] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (!isAuthenticated) return;

        let cancelled = false;

        const loadArticle = async () => {
            setIsLoading(true);
            setLoadedId(null);
            setError("");
            setSuccess("");

            try {
                if (!id) {
                    throw new Error("Article ID is missing.");
                }

                const article = await getById(id);

                if (cancelled) return;
                console.log(article)

                if (!article?.data._id) {
                    throw new Error("Article not found.");
                }

                setTitle(article.data.title ?? "");
                setDescription(article.data.description ?? "");
                setContent(article.data.content ?? "");
                setReadingTime(article.data.readingTime ?? 1);
                setDate(article.data.createdAt?.slice(0, 10) ?? getToday());
                setLoadedId(id);
            } catch (error: unknown) {
                if (cancelled) return;

                setError(getErrorMessage(error, "Failed to load article."));
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        void loadArticle();

        return () => {
            cancelled = true;
        };
    }, [id, isAuthenticated]);

    const handlePublish = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (
            !isAuthenticated ||
            isPublishing ||
            isLoading ||
            !id ||
            loadedId !== id
        ) {
            return;
        }

        setError("");
        setSuccess("");

        if (!title.trim() || !description.trim() || !content.trim() || !date) {
            setError("Please fill in all required fields.");
            return;
        }

        if (!Number.isInteger(readingTime) || readingTime < 1) {
            setError("Reading time must be a whole number of at least 1 minute.");
            return;
        }

        const createdAt = new Date(`${date}T00:00:00Z`);

        if (Number.isNaN(createdAt.getTime())) {
            setError("Please enter a valid creation date.");
            return;
        }

        setIsPublishing(true);

        try {
            var res = await updateArticle({
                id,
                title: title.trim(),
                description: description.trim(),
                content,
                readingTime,
                createdAt: createdAt.toISOString(),
            });
            if (res.isSuccess) {
                toast.success("the article was updated successfully!")
            }

        } catch (error: unknown) {
            toast.error("Error occurred!");
        } finally {
            setIsPublishing(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <ModalGetAdminCredentials
                onAuthenticated={() => setIsAuthenticated(true)}
            />
        );
    }

    if (isLoading || (loadedId !== id && !error)) {
        return (
            <p role="status" className="px-6 py-8">
                Loading article...
            </p>
        );
    }

    if (loadedId !== id) {
        return (
            <p role="alert" className="px-6 py-8 text-red-500">
                {error || "Unable to load article."}
            </p>
        );
    }

    
    const DeleteArticle = async (id: string) => {
        try {
            const result = await deleteArticle(id);
            if (result.isSuccess) {
                toast.success("The article was deleted succesfully!");
            }
            toast.error("Error occurred");
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    return (
        <form
            onSubmit={handlePublish}
            className="mx-auto max-w-7xl px-6 py-8"
        >
            <div className="mb-8 flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Update Article</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Edit this article.
                    </p>
                </div>
                <div className="flex gap-5">
                    <button className="bg-red-700 py-2.5 px-5 hover:bg-red-800" onClick={() => DeleteArticle(id)}>
                        Delete
                    </button>

                    <button
                        type="submit"
                        disabled={isPublishing}
                        className="rounded-lg bg-blue-500 px-5 py-2.5 font-medium text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isPublishing ? "Saving..." : "Save changes"}
                    </button>
                </div>
            </div>

            {error && (
                <p role="alert" className="mb-6 text-sm text-red-500">
                    {error}
                </p>
            )}

            {success && (
                <p role="status" className="mb-6 text-sm text-green-500">
                    {success}
                </p>
            )}

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <fieldset
                    disabled={isPublishing}
                    className="min-w-0 space-y-6"
                >
                    <div>
                        <label
                            htmlFor="title"
                            className="mb-2 block text-sm font-medium"
                        >
                            Title
                        </label>

                        <input
                            id="title"
                            type="text"
                            required
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            placeholder="Enter article title..."
                            className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="description"
                            className="mb-2 block text-sm font-medium"
                        >
                            Description
                        </label>

                        <textarea
                            id="description"
                            required
                            rows={3}
                            value={description}
                            onChange={(event) =>
                                setDescription(event.target.value)
                            }
                            placeholder="Enter a short article description..."
                            className="w-full resize-y rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-wrap gap-6">
                        <div>
                            <label
                                htmlFor="date"
                                className="mb-2 block text-sm font-medium"
                            >
                                Creation date
                            </label>

                            <input
                                id="date"
                                type="date"
                                required
                                value={date}
                                onChange={(event) => setDate(event.target.value)}
                                className="rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="readingTime"
                                className="mb-2 block text-sm font-medium"
                            >
                                Reading time (minutes)
                            </label>

                            <input
                                id="readingTime"
                                type="number"
                                required
                                min={1}
                                step={1}
                                value={readingTime}
                                onChange={(event) =>
                                    setReadingTime(Number(event.target.value))
                                }
                                className="w-32 rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="content"
                            className="mb-2 block text-sm font-medium"
                        >
                            Content (Markdown)
                        </label>

                        <textarea
                            id="content"
                            required
                            value={content}
                            onChange={(event) => setContent(event.target.value)}
                            placeholder={markdownPlaceholder}
                            className="min-h-[600px] w-full resize-y rounded-lg border bg-background p-4 font-mono text-sm leading-6 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </fieldset>

                <div className="min-w-0">
                    <h3 className="mb-2 text-sm font-medium">Preview</h3>

                    <div className="min-h-[600px] overflow-hidden rounded-lg border bg-background p-6">
                        {title.trim() && (
                            <h2 className="mb-3 break-words text-2xl font-bold">
                                {title}
                            </h2>
                        )}

                        {description.trim() && (
                            <p className="mb-4 break-words text-muted-foreground">
                                {description}
                            </p>
                        )}

                        <p className="mb-6 text-sm text-muted-foreground">
                            {date} · {readingTime} min read
                        </p>

                        {content.trim() ? (
                            <div className="prose max-w-none break-words dark:prose-invert prose-pre:overflow-x-auto">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {content}
                                </ReactMarkdown>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Your Markdown preview will appear here...
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </form>
    );
};

export default UpdateArticle;