import { EaCRuntimeHandlers } from '@fathym/eac/runtime';
import { respond } from '@fathym/common';

export default {
  GET(_req, ctx) {
    return respond(ctx.Runtime.EaC);
  },
} as EaCRuntimeHandlers;
