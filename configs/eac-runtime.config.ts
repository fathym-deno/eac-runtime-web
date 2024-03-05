import { DefaultEaCConfig, defineEaCConfig, EaCRuntime, IS_BUILDING } from '@fathym/eac/runtime';
import EaCRuntimeWebPlugin from '../src/plugins/EaCRuntimeWebPlugin.ts';

export const config = defineEaCConfig({
  ModifierResolvers: {},
  // Plugins: [['@fathym/eac/runtime/src/runtime/plugins/FathymDemoPlugin.ts', 6121], ...(DefaultEaCConfig.Plugins || [])],
  Plugins: [
    new EaCRuntimeWebPlugin({ marketingPort: 6120, dashboardPort: 6121 }),
    ...(DefaultEaCConfig.Plugins || []),
  ],
  Server: {
    port: 6121,
  },
});

export function configure(_rt: EaCRuntime): Promise<void> {
  if (IS_BUILDING) {
    Deno.env.set('SUPPORTS_WORKERS', 'false');
  }

  return Promise.resolve();
}
