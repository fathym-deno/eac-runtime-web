import { EaCRuntimeHandlerResult, PageProps } from '@fathym/eac/runtime';
import Button from '$local/apps/components/Button.tsx';
import Button2 from '$local/apps/components/Button2.tsx';
import Shell from '$local/apps/components/Shell.tsx';

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

export default function Index({ Data }: PageProps) {
  return (
    // <Shell value="Shell 2">
    //   <Shell value="Shell 2 > sub">
    //     <Button2>Hey Original Child</Button2>
    //   </Shell>
    // </Shell>
    <div>
      <div>
        <Shell value='Shell 2'>
          <Shell value='Shell 2 > sub'>
            <Shell value='Shell 2 > sub > sub'>
              <Shell value='Shell 2 > sub > sub > sub'>
                <Button2>Hey Original Child</Button2>
              </Shell>
            </Shell>
          </Shell>
        </Shell>

        {[
          Array.from(new Array(10).keys()).map((e, i) => {
            return (
              <>
                <div>
                  <Button />
                </div>

                <div class='-:[&>*]:bg-green-500'>
                  <Button2>Hey {i} Child</Button2>
                </div>
              </>
            );
          }),
        ]}
      </div>

      <button onClick={() => alert(Data.Hey)}>
        {Data.Hey} - {Data.Thing}
      </button>

      <a href='/'>Here</a>

      <a href='/' eac-bypass-base>
        There
      </a>
    </div>
  );
}
