import {
  EaCAIChatProcessor,
  EaCAPIProcessor,
  EaCAzureADB2CProviderDetails,
  EaCAzureOpenAIEmbeddingsDetails,
  EaCAzureOpenAILLMDetails,
  EaCAzureSearchAIVectorStoreDetails,
  EaCBaseHREFModifierDetails,
  EaCDenoKVCacheModifierDetails,
  EaCDenoKVDatabaseDetails,
  EaCDenoKVDistributedFileSystem,
  EaCDFSProcessor,
  EaCJWTValidationModifierDetails,
  EaCKeepAliveModifierDetails,
  EaCLocalDistributedFileSystem,
  EaCMarkdownToHTMLModifierDetails,
  EaCNPMDistributedFileSystem,
  EaCOAuthModifierDetails,
  EaCOAuthProcessor,
  EaCPreactAppProcessor,
  EaCProxyProcessor,
  EaCRedirectProcessor,
  EaCRemoteDistributedFileSystem,
  EaCTailwindProcessor,
  EaCTracingModifierDetails,
  EaCWatsonXLLMDetails,
} from '@fathym/eac';
import { EaCRuntimePlugin, EaCRuntimePluginConfig } from '@fathym/eac/runtime';
import { AzureAISearchQueryType } from '@langchain/community/vectorstores/azure_aisearch';

export default class EaCRuntimeWebPlugin implements EaCRuntimePlugin {
  constructor(
    protected cfg?: {
      dashboardPort?: number;

      marketingPort?: number;
    },
  ) {}

  public Build(): Promise<EaCRuntimePluginConfig> {
    const config: EaCRuntimePluginConfig = {
      Name: 'EaCRuntimeWebPlugin',
      EaC: {
        EnterpriseLookup: 'local-eac',
        Projects: {
          marketing: {
            Details: {
              Name: 'Main marketing website',
              Description: 'The main marketing website to use.',
              Priority: 100,
            },
            ResolverConfigs: {
              dev: {
                Hostname: 'localhost',
                Port: this.cfg?.marketingPort || 6120,
              },
            },
            ModifierResolvers: {
              keepAlive: {
                Priority: 1000,
              },
            },
            ApplicationResolvers: {
              apiProxy: {
                PathPattern: '/api-reqres*',
                Priority: 200,
                IsPrivate: true,
                IsTriggerSignIn: true,
              },
              docs: {
                PathPattern: '/*',
                Priority: 100,
              },
              docsDirect: {
                PathPattern: '/fathym',
                Priority: 200,
              },
              oauth: {
                PathPattern: '/oauth/*',
                Priority: 500,
              },
            },
          },
          dashboard: {
            Details: {
              Name: 'Dashboard website',
              Description: 'The dashboard website to use.',
              Priority: 200,
            },
            ResolverConfigs: {
              dev: {
                Hostname: 'localhost',
                Port: this.cfg?.dashboardPort || 6121,
              },
              denoDeploy: {
                Hostname: 'eac-runtime.deno.dev',
              },
              azureDeploy: {
                Hostname: 'eac-runtime-web.azurewebsites.net',
              },
              azureHook: {
                Hostname: '*',
                Port: this.cfg?.dashboardPort || 6121,
              },
              fathym: {
                Hostname: 'eac-runtime.fathym.com',
              },
            },
            ModifierResolvers: {
              keepAlive: {
                Priority: 1000,
              },
              oauth: {
                Priority: 1200,
              },
              // tracing: {
              //   Priority: 1300,
              // },
            },
            ApplicationResolvers: {
              apiProxy: {
                PathPattern: '/api-reqres*',
                Priority: 200,
                IsPrivate: true,
                IsTriggerSignIn: true,
              },
              chat: {
                PathPattern: '/api/chat',
                Priority: 300,
                // IsPrivate: true,
                // IsTriggerSignIn: true,
              },
              dashboard: {
                PathPattern: '/*',
                Priority: 100,
              },
              denoInstall: {
                PathPattern: '/deno/install',
                Priority: 5001,
                UserAgentRegex: '^Deno*',
              },
              denoLocalInstall: {
                PathPattern: '/deno/*',
                Priority: 5000,
                UserAgentRegex: '^Deno*',
              },
              docs: {
                PathPattern: '/docs/*',
                Priority: 2000,
              },
              docsDirect: {
                PathPattern: '/docs',
                Priority: 2000,
              },
              fathymWhiteLogo: {
                PathPattern: '/img/Fathym-logo-white-01.png',
                Priority: 2000,
              },
              favicon: {
                PathPattern: '/img/favicon.ico',
                Priority: 2000,
              },
              oauth: {
                PathPattern: '/oauth/*',
                Priority: 500,
              },
              localApiProxy: {
                PathPattern: '/api-local*',
                Priority: 500,
              },
              localTestApp: {
                PathPattern: '/test*',
                Priority: 500,
              },
              publicWebBlog: {
                PathPattern: '/blog*',
                Priority: 500,
              },
              tailwind: {
                PathPattern: '/tailwind*',
                Priority: 500,
              },
              // profile: {
              //   PathPattern: '/profile/*',
              //   Priority: 500,
              // },
            },
          },
        },
        Applications: {
          apiProxy: {
            Details: {
              Name: 'Simple API Proxy',
              Description: 'A proxy',
            },
            Processor: {
              Type: 'Proxy',
              ProxyRoot: 'https://reqres.in/api',
            } as EaCProxyProcessor,
          },
          chat: {
            Details: {
              Name: 'Chat Site',
              Description: 'The chat used to display the main dashboard',
            },
            Processor: {
              Type: 'AIChat',
              AILookup: 'core',
              DefaultInput: {
                input: 'Tell me about Fathym Inc',
                context: '',
              },
              DefaultRAGInput: {
                input: 'Tell me about Fathym Inc',
              },
              EmbeddingsLookup: 'azureOpenAI',
              LLMLookup: 'azureOpenAI',
              VectorStoreLookup: 'azureSearchAI',
              UseSSEFormat: true,
              Messages: [
                [
                  'system',
                  'You are an expert data engineer, data scientist, and will help the user create a KQL query. Keeping in mind the following context:\n\n{context}',
                ],
                ['human', '{input}'],
              ],
            } as EaCAIChatProcessor,
          },
          dashboard: {
            Details: {
              Name: 'Dashboard Site',
              Description: 'The site used to display the main dashboard',
            },
            ModifierResolvers: {
              'css-js-img-cache': {
                Priority: 500,
              },
            },
            Processor: {
              Type: 'Proxy',
              // ProxyRoot: 'http://localhost:8000',
              // ProxyRoot: 'http://localhost:5437',
              // ProxyRoot: 'https://dashboard.openbiotech.co',
              ProxyRoot: 'https://biotech-manager-web.azurewebsites.net',
              CacheControl: {
                'text\\/html': `private, max-age=${60 * 5}`,
                'image\\/': `public, max-age=${60 * 60 * 24 * 365}, immutable`,
                'application\\/javascript': `public, max-age=${60 * 60 * 24 * 365}, immutable`,
                'application\\/typescript': `public, max-age=${60 * 60 * 24 * 365}, immutable`,
                'text\\/css': `public, max-age=${60 * 60 * 24 * 365}, immutable`,
              },
            } as EaCProxyProcessor,
          },
          denoInstall: {
            Details: {
              Name: 'EaC Runtime Deno Install',
              Description: 'A script to use for installing the deno runtime.',
            },
            Processor: {
              Type: 'Redirect',
              Redirect: 'https://deno.land/x/fathym_eac_runtime/install.ts',
            } as EaCRedirectProcessor,
          },
          denoLocalInstall: {
            Details: {
              Name: 'EaC Runtime Local Deno Install',
              Description: 'A script to use for installing the deno runtime.',
            },
            // ModifierResolvers: ['static-cache'],
            Processor: {
              Type: 'DFS',
              DFSLookup: 'local:$root',
            } as EaCDFSProcessor,
          },
          docs: {
            Details: {
              Name: 'Home Site',
              Description: 'The home site to be used for the marketing of the project',
            },
            ModifierResolvers: {
              markdown: {
                Priority: 10,
              },
            },
            Processor: {
              Type: 'DFS',
              DFSLookup: 'remote:fathym_eac_runtime/docs',
            } as EaCDFSProcessor,
          },
          docsDirect: {
            Details: {
              Name: 'Docs Direct Redirect',
              Description: 'A redirect to /docs/ when going to /docs',
            },
            Processor: {
              Type: 'Redirect',
              Redirect: '/docs/',
            } as EaCRedirectProcessor,
          },
          fathymWhiteLogo: {
            Details: {
              Name: 'Standard Fathym White Logo',
              Description: 'The standard fathym white logo.',
            },
            ModifierResolvers: {
              'static-cache': {
                Priority: 500,
              },
            },
            Processor: {
              Type: 'Proxy',
              ProxyRoot: 'https://www.fathym.com/img/Fathym-logo-white-01.png',
              RedirectMode: 'follow',
            } as EaCProxyProcessor,
          },
          favicon: {
            Details: {
              Name: 'Standard Favicon',
              Description: 'The standard favicon',
            },
            ModifierResolvers: {
              'static-cache': {
                Priority: 500,
              },
            },
            Processor: {
              Type: 'Proxy',
              ProxyRoot: 'https://www.fathym.com/img/favicon.ico',
              RedirectMode: 'follow',
            } as EaCProxyProcessor,
          },
          localApiProxy: {
            Details: {
              Name: 'Simple Local API Proxy',
              Description: 'A proxy',
            },
            ModifierResolvers: {
              jwtValidate: {
                Priority: 1000,
              },
            },
            Processor: {
              Type: 'API',
              DFSLookup: 'local:apps/api',
              DefaultContentType: 'application/json',
            } as EaCAPIProcessor,
          },
          localTestApp: {
            Details: {
              Name: 'Simple Local Test Preact App',
              Description: 'A preact app',
            },
            ModifierResolvers: {},
            Processor: {
              Type: 'PreactApp',
              AppDFSLookup: 'local:apps/test',
              BundleDFSLookup: 'denokv:apps/test/_bundle',
              ComponentDFSLookups: ['local:apps/components'],
            } as EaCPreactAppProcessor,
          },
          oauth: {
            Details: {
              Name: 'OAuth Site',
              Description: 'The site for use in OAuth workflows for a user',
            },
            Processor: {
              Type: 'OAuth',
              ProviderLookup: 'adb2c',
            } as EaCOAuthProcessor,
          },
          // profile: {
          //   Details: {
          //     Name: 'Profile Site',
          //     Description:
          //       'The site used to for user profile display and management',
          //   },
          //   Processor: {},
          // },
          publicWebBlog: {
            Details: {
              Name: 'Public Web Blog Site',
              Description: 'The public web blog site to be used for the marketing of the project',
            },
            ModifierResolvers: {
              'static-cache': {
                Priority: 500,
              },
            },
            Processor: {
              Type: 'DFS',
              DFSLookup: 'npm:@lowcodeunit/public-web-blog',
              CacheControl: {
                'text\\/html': `private, max-age=${60 * 5}`,
                'image\\/': `public, max-age=${60 * 60 * 24 * 365}, immutable`,
                'application\\/javascript': `public, max-age=${60 * 60 * 24 * 365}, immutable`,
                'application\\/typescript': `public, max-age=${60 * 60 * 24 * 365}, immutable`,
                'text\\/css': `public, max-age=${60 * 60 * 24 * 365}, immutable`,
              },
            } as EaCDFSProcessor,
          },
          tailwind: {
            Details: {
              Name: 'Tailwind for the Site',
              Description: 'A tailwind config for the site',
            },
            ModifierResolvers: {},
            Processor: {
              Type: 'Tailwind',
              DFSLookups: [
                'local:apps/test',
                // 'denokv:apps/test/_bundle',
                'local:apps/components',
              ],
              ConfigPath: '/apps/tailwind/tailwind.config.ts',
              StylesTemplatePath: './apps/tailwind/styles.css',
              CacheControl: {
                'text\\/css': `public, max-age=${60 * 60 * 24 * 365}, immutable`,
              },
            } as EaCTailwindProcessor,
          },
        },
        DFS: {
          'npm:@lowcodeunit/public-web-blog': {
            Type: 'NPM',
            DefaultFile: 'index.html',
            Package: '@lowcodeunit/public-web-blog',
            Version: 'latest',
          } as EaCNPMDistributedFileSystem,
          'local:$root': {
            Type: 'Local',
            FileRoot: './',
          } as EaCLocalDistributedFileSystem,
          'remote:fathym_eac_runtime/docs': {
            Type: 'Remote',
            DefaultFile: 'Overview.md',
            RemoteRoot: 'https://deno.land/x/fathym_eac_runtime/docs/',
          } as EaCRemoteDistributedFileSystem,
          'local:apps/api': {
            Type: 'Local',
            FileRoot: './apps/api/',
            DefaultFile: 'index.ts',
            Extensions: ['ts'],
          } as EaCLocalDistributedFileSystem,
          'local:apps/test': {
            Type: 'Local',
            FileRoot: './apps/test/',
            DefaultFile: 'index.tsx',
            Extensions: ['tsx'],
          } as EaCLocalDistributedFileSystem,
          'denokv:apps/test/_bundle': {
            Type: 'DenoKV',
            DatabaseLookup: 'dfs',
            FileRoot: './apps/test/_bundle/',
            RootKey: ['DFS', 'PreactApp', 'localTestApp'],
          } as EaCDenoKVDistributedFileSystem,
          'local:apps/components': {
            Type: 'Local',
            FileRoot: './apps/components/',
          } as EaCLocalDistributedFileSystem,
        },
        Providers: {
          adb2c: {
            Details: {
              Name: 'Azure ADB2C OAuth Provider',
              Description: 'The provider used to connect with our azure adb2c instance',
              ClientID: Deno.env.get('AZURE_ADB2C_CLIENT_ID')!,
              ClientSecret: Deno.env.get('AZURE_ADB2C_CLIENT_SECRET')!,
              Scopes: ['openid', Deno.env.get('AZURE_ADB2C_CLIENT_ID')!],
              Domain: Deno.env.get('AZURE_ADB2C_DOMAIN')!,
              PolicyName: Deno.env.get('AZURE_ADB2C_POLICY')!,
              TenantID: Deno.env.get('AZURE_ADB2C_TENANT_ID')!,
            } as EaCAzureADB2CProviderDetails,
          },
        },
        Databases: {
          cache: {
            Details: {
              Type: 'DenoKV',
              Name: 'Local Cache',
              Description: 'The Deno KV database to use for local caching',
              DenoKVPath: Deno.env.get('LOCAL_CACHE_DENO_KV_PATH') || undefined,
            } as EaCDenoKVDatabaseDetails,
          },
          dfs: {
            Details: {
              Type: 'DenoKV',
              Name: 'Database for the DFS',
              Description: 'The Deno KV database to use for the DFS',
              DenoKVPath: Deno.env.get('DFS_DENO_KV_PATH') || undefined,
            } as EaCDenoKVDatabaseDetails,
          },
        },
        Modifiers: {
          baseHref: {
            Details: {
              Type: 'BaseHREF',
              Name: 'Base HREF',
              Description: 'Adjusts the base HREF of a response based on configureation.',
            } as EaCBaseHREFModifierDetails,
          },
          'css-js-img-cache': {
            Details: {
              Type: 'DenoKVCache',
              Name: 'CSS/JS/Image Cache',
              Description:
                'Lightweight cache to use that stores data in a DenoKV database for all css, js, and images.',
              DenoKVDatabaseLookup: 'cache',
              CacheSeconds: 60 * 20,
              PathFilterRegex:
                `^[^\\s]*(iconset\\/icons|\\.(apng|avif|bmp|cur|gif|ico|jfif|jpg|jpeg|pjpeg|pjp|png|svg|tiff|tif|webp|js|ts|css|))(\\?|#|$)`,
            } as EaCDenoKVCacheModifierDetails,
          },
          jwtValidate: {
            Details: {
              Type: 'JWTValidation',
              Name: 'Validate JWT',
              Description: 'Validate incoming JWTs to restrict access.',
            } as EaCJWTValidationModifierDetails,
          },
          keepAlive: {
            Details: {
              Type: 'KeepAlive',
              Name: 'Deno KV Cache',
              Description: 'Lightweight cache to use that stores data in a DenoKV database.',
              KeepAlivePath: '/_eac/alive',
            } as EaCKeepAliveModifierDetails,
          },
          markdown: {
            Details: {
              Type: 'MarkdownToHTML',
              Name: 'Markdown to HTML',
              Description: 'A modifier to convert markdown to HTML.',
            } as EaCMarkdownToHTMLModifierDetails,
          },
          oauth: {
            Details: {
              Type: 'OAuth',
              Name: 'OAuth',
              Description: 'Used to restrict user access to various applications.',
              ProviderLookup: 'adb2c',
              SignInPath: '/oauth/signin',
            } as EaCOAuthModifierDetails,
          },
          'static-cache': {
            Details: {
              Type: 'DenoKVCache',
              Name: 'Static Cache',
              Description:
                'Lightweight cache to use that stores data in a DenoKV database for static sites.',
              DenoKVDatabaseLookup: 'cache',
              CacheSeconds: 60 * 20,
            } as EaCDenoKVCacheModifierDetails,
          },
          tracing: {
            Details: {
              Type: 'Tracing',
              Name: 'Tracing',
              Description: 'Lightweight cache to use that stores data in a DenoKV database.',
              TraceRequest: true,
              TraceResponse: true,
            } as EaCTracingModifierDetails,
          },
        },
        AIs: {
          core: {
            Details: {
              Name: 'Core AI',
              Description: 'The Core AI for generative solutions.',
            },
            Embeddings: {
              azureOpenAI: {
                Details: {
                  Name: 'Azure OpenAI LLM',
                  Description: 'The LLM for interacting with Azure OpenAI.',
                  APIKey: Deno.env.get('AZURE_OPENAI_KEY')!,
                  Endpoint: Deno.env.get('AZURE_OPENAI_ENDPOINT')!,
                  DeploymentName: 'text-embedding-ada-002',
                } as EaCAzureOpenAIEmbeddingsDetails,
              },
            },
            LLMs: {
              azureOpenAI: {
                Details: {
                  Name: 'Azure OpenAI LLM',
                  Description: 'The LLM for interacting with Azure OpenAI.',
                  APIKey: Deno.env.get('AZURE_OPENAI_KEY')!,
                  Endpoint: Deno.env.get('AZURE_OPENAI_ENDPOINT')!,
                  DeploymentName: 'gpt-4-turbo',
                  ModelName: 'gpt-4',
                  Streaming: true,
                  Verbose: false,
                } as EaCAzureOpenAILLMDetails,
              },
              watsonX: {
                Details: {
                  Name: 'WatsonX LLM',
                  Description: 'The LLM for interacting with WatsonX.',
                  APIKey: Deno.env.get('IBM_CLOUD_API_KEY')!,
                  ProjectID: Deno.env.get('IBM_WATSON_X_PROJECT_ID')!,
                  ModelID: 'meta-llama/llama-2-70b-chat',
                  ModelParameters: {
                    max_new_tokens: 100,
                    min_new_tokens: 0,
                    stop_sequences: [],
                    repetition_penalty: 1,
                  },
                } as EaCWatsonXLLMDetails,
              },
            },
            VectorStores: {
              azureSearchAI: {
                Details: {
                  Name: 'Azure Search AI',
                  Description: 'The Vector Store for interacting with Azure Search AI.',
                  APIKey: Deno.env.get('AZURE_AI_SEARCH_KEY')!,
                  Endpoint: Deno.env.get('AZURE_AI_SEARCH_ENDPOINT')!,
                  EmbeddingsLookup: 'azureOpenAI',
                  QueryType: AzureAISearchQueryType.SimilarityHybrid,
                } as EaCAzureSearchAIVectorStoreDetails,
              },
            },
          },
        },
      },
    };

    return Promise.resolve(config);
  }
}
