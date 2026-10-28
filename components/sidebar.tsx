"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Archive,
    ArrowUpRight,
    Folder,
    Home,
    Layers,
    Leaf,
    Mail,
    Menu,
    Rss,
    Share2,
    UserRound,
    X,
} from "lucide-react"

import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa6";
import { ModeToggle } from "./theme-toggle"

const navigation = [
    { label: "Home", href: "/home", icon: Home },
    { label: "About", href: "/about", icon: UserRound },
    { label: "Stack", href: "/stack", icon: Layers },
]

export default function Sidebar() {
    const pathname = usePathname()
    const [mobileOpen, setMobileOpen] = useState(false)

    return (
        <>
            {/* Mobile menu button */}
            <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation"
                aria-expanded={mobileOpen}
                aria-controls="site-sidebar"
                className="fixed bottom-5 left-5 z-40 flex size-11 items-center justify-center rounded-xl border border-border bg-background text-foreground shadow-lg md:hidden"
            >
                <Menu className="size-5" />
            </button>

            {/* Mobile backdrop */}
            {mobileOpen && (
                <button
                    type="button"
                    aria-label="Close navigation"
                    onClick={() => setMobileOpen(false)}
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                />
            )}

            <aside
                id="site-sidebar"
                aria-label="Main navigation"
                className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-200 md:sticky md:top-0 md:z-auto md:h-dvh md:shrink-0 md:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Brand */}
                <div className="flex items-center justify-between px-6 pt-6">
                    <button
                        type="button"
                        onClick={() => setMobileOpen(false)}
                        aria-label="Close navigation"
                        className="rounded-md p-1 text-muted-foreground hover:text-sidebar-foreground md:hidden"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {/* Scrollable profile and navigation */}
                <div className="min-h-0 flex-1 overflow-y-auto px-6">
                    <section className="flex flex-col items-center border-b border-sidebar-border pb-6 pt-7 text-center">
                        <div className="mb-3 flex size-17 items-center justify-center overflow-hidden rounded-xl bg-sidebar-accent">
                            {/* Replace this icon with your profile image. */}
                                <img
                                    src="/profile.png"
                                    alt="Profile"
                                    className="h-full w-full object-cover"
                                />
                        </div>

                        <h2 className="text-base font-semibold">Yunus Sadikhov</h2>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                            CyberSecurity Blog
                        </p>
                    </section>

                    <nav className="mt-5 flex flex-col gap-1">
                        {navigation.map(({ label, href, icon: Icon }) => {
                            const active =
                                href === "/"
                                    ? pathname === "/"
                                    : pathname === href || pathname.startsWith(`${href}/`)

                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    aria-current={active ? "page" : undefined}
                                    onClick={() => setMobileOpen(false)}
                                    className={`flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-sidebar-ring ${active
                                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                        : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                        }`}
                                >
                                    <Icon
                                        className={`size-4 shrink-0 ${active ? "text-sky-600 dark:text-sky-400" : ""
                                            }`}
                                        aria-hidden="true"
                                    />
                                    {label}
                                </Link>
                            )
                        })}
                    </nav>
                </div>

                {/* Footer */}
                <footer className="mx-6 border-t border-sidebar-border py-5">
                    <div className="flex items-center justify-around text-muted-foreground">
                        <ModeToggle />

                        <Link
                            href="https://www.linkedin.com/in/yunus-sadikhov/"
                            aria-label="LinkedIn"
                            className="rounded p-2 transition-colors hover:text-sidebar-foreground"
                        >
                            <FaLinkedin size={15} />
                        </Link>

                        <Link
                            href="https://github.com/YunusSad"
                            aria-label="GitHub"
                            className="rounded p-2 transition-colors hover:text-sidebar-foreground"
                        >
                            <FaGithub size={15} />
                        </Link>
                    </div>
                    <p className="mt-3 text-center font-mono text-[10px] text-muted-foreground">
                        v1.0.0 Rights Reserved
                    </p>
                </footer>
            </aside>
        </>
    )
}


