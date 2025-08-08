import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
    return (
        <nav className="text-center mt-4">
            {links.map((link) => (
                <Link
                    preserveScroll
                    href={link.url || ''}
                    key={link.label}
                    className={
                        "inline-block py-2 px-3 rounded-lg text-gray-700 text-xs " +
                        (link.active ? "bg-gray-950 text-white " : " ") +
                        (!link.url ? "!text-gray-400 cursor-not-allowed " : "hover:bg-gray-950/20 ")
                    }
                    dangerouslySetInnerHTML={{ __html: link.label }}
                ></Link>
            ))}
        </nav>
    );
}
