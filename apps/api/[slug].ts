import { EaCRuntimeHandlers } from '@fathym/eac/runtime';
import { respond } from '@fathym/common';

export default {
  GET(_req, ctx) {
    return respond({ Hello: `World${ctx.Params.slug}` });
  },
} as EaCRuntimeHandlers;
