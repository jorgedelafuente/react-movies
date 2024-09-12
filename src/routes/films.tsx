import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/films')({
    component: () => (
        <div>
            Hello /films!
            <hr />
            <Outlet />
        </div>
    ),
});
