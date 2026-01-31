'use client';

import { usePathname } from 'next/navigation';

/**
 * A wrapper component that hides its children if the current route is an admin page.
 * This allows us to hide global elements like the StaggeredMenu on admin routes.
 */
export default function NavbarVisibilityWrapper({ children }) {
    const pathname = usePathname();

    // Check if the current path starts with /admin
    const isAdminPage = pathname.startsWith('/admin');

    // If we are on an admin page, don't render the children (menu/auth button)
    if (isAdminPage) {
        return null;
    }

    return <>{children}</>;
}
