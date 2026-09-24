import Container from '@/components/layout/container/container.component';

import Counter from './counter.component';

const About = () => {
   return (
      <Container>
         <div className="gap-4 p-4 text-copy">
            <h1 className="p-4">About</h1>

            <h2 className="px-4 pt-2">Tech Stack</h2>
            <p className="max-w-prose p-4 leading-relaxed">
               Built with React, Typescript, React Query, Tanstack Router,
               Zustand, Tailwind, CSS
            </p>

            <Counter />
         </div>
      </Container>
   );
};

export default About;
