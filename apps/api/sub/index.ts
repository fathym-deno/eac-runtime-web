import { EaCRuntimeHandlers } from '@fathym/eac/runtime';
import { respond } from '@fathym/common';

export default {
  GET(_req, _ctx) {
    return respond({ Hello: 'WorldSub' });
  },
} as EaCRuntimeHandlers;
