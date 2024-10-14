import Container from '@/components/layout/container/container.component';
import Counter from './counter.component';

const About = () => {
   return (
      <Container>
         <div className="text-copy gap-4 p-4">
            <h1 className="p-4">About</h1>

            <h3>Tech Stack</h3>
            <p className="p-2">
               Built with React, Typescript, React Query, Tanstack Router,
               Tailwind, CSS
            </p>

            <Counter />
         </div>
      </Container>
   );
};

export default About;
