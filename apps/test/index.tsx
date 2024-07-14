import { EaCRuntimeHandlerResult, PageProps } from '@fathym/eac/runtime';
import Counter from '../components/Counter.tsx';

export const handler: EaCRuntimeHandlerResult = [
  (_req, ctx) => {
    ctx.State.Something = 'Something';

    return ctx.Next();
  },
  {
    GET: (_req, ctx) => {
      return ctx.Render({
        Thing: ctx.State.Something as string,
        Hey: 'Howdy2',
      });
    },
  },
];

export default function Index({}: PageProps) {
  return (
    <div>
      <div class='py-16 px-4 bg-slate-500'>
        <div class='mx-auto block w-[350px] text-center'>
          <h1 class='text-4xl'>Fathym EaC Runtime</h1>

          <p class='text-lg'>
            Bring your applications and ideas to life with ease.
          </p>

          <div class='flex flex-row py-8'>
            <Counter />
          </div>
        </div>
      </div>

      <div class='p-4'>
        <h2 class='text-2xl'>Welcome</h2>
      </div>
    </div>
  );
}
