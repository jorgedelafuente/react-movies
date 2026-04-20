import { createFileRoute } from '@tanstack/react-router';

import About from '@/views/about/about.view';

export const Route = createFileRoute('/about/')({
   component: () => <About />,
});
