import Link from "next/link"
import React from "react"

interface iBBtn {
    children: React.ReactNode;
    href: string;
}

export default function Bottombtn({
    children,
    href
}: iBBtn) {
    return (
        <Link href={href} legacyBehavior>
            <a className="fixed hover:bg-orange-500 transition-colors cursor-pointer bottom-14 right-5 shadow-xl bg-orange-400 rounded-full p-4 text-white">
                {children}
            </a>
        </Link>

    )
}