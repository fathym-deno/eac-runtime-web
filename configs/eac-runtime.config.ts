import { DefaultEaCConfig, defineEaCConfig } from '@fathym/eac/runtime';
import EaCRuntimeWebPlugin from '../plugins/EaCRuntimeWebPlugin.ts';

export default defineEaCConfig({
  ModifierLookups: [],
  // Plugins: [['@fathym/eac/runtime/runtime/plugins/FathymDemoPlugin.ts', 6121], ...(DefaultEaCConfig.Plugins || [])],
  Plugins: [
    new EaCRuntimeWebPlugin({ marketingPort: 6120, dashboardPort: 6121 }),
    ...(DefaultEaCConfig.Plugins || []),
  ],
  Server: {
    port: 6121,
  },
});
