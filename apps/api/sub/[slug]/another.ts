import { EaCRuntimeHandlers } from '@fathym/eac/runtime';
import { respond } from '@fathym/common';

export default {
  GET(_req, ctx) {
    return respond({ Hello: `WorldSub${ctx.Params.slug}Another` });
  },
} as EaCRuntimeHandlers;
