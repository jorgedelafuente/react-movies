import Counter from './counter.component';

const About = () => {
   return (
      <>
         <div className="flex flex-col gap-4 p-4 text-center">
            <h1>About</h1>

            <h3>Tech Stack</h3>
            <p>
               Built with React, Typescript, React Query, Tanstack Router,
               Tailwind, CSS
            </p>

            <Counter />
         </div>
      </>
   );
};

export default About;
