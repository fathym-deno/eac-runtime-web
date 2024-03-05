import { EaCRuntimeHandler } from '@fathym/eac/runtime';

export default ((_req, ctx) => {
  console.log(
    `************************* > Sub ${ctx.Params.slug} MIDDLEWARE *************************`,
  );

  console.log(ctx.State);

  const resp = ctx.Next();

  console.log(
    `************************* Sub ${ctx.Params.slug}  MIDDLEWARE > *************************`,
  );

  return resp;
}) as EaCRuntimeHandler;
