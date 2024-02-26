import {
  EaCAIChatProcessor,
  EaCAzureADB2CProviderDetails,
  EaCAzureOpenAIEmbeddingsDetails,
  EaCAzureOpenAILLMDetails,
  EaCAzureSearchAIVectorStoreDetails,
  EaCDenoKVCacheModifierDetails,
  EaCDenoKVDatabaseDetails,
  EaCDFSProcessor,
  EaCKeepAliveModifierDetails,
  EaCLocalDistributedFileSystem,
  EaCNPMDistributedFileSystem,
  EaCOAuthModifierDetails,
  EaCOAuthProcessor,
  EaCProxyProcessor,
  EaCRedirectProcessor,
  EaCTracingModifierDetails,
  EaCWatsonXLLMDetails,
} from '@fathym/eac';
import { defineEaCConfig } from '@fathym/eac/runtime';
import { AzureAISearchQueryType } from 'npm:@langchain/community/vectorstores/azure_aisearch';

export default defineEaCConfig({
  ModifierLookups: [],
  Server: {
    port: 6121,
  },
  EaC: {
    EnterpriseLookup: 'local-eac',
    Projects: {
      marketing: {
        Details: {
          Name: 'Main marketing website',
          Description: 'The main marketing website to use.',
          Priority: 100,
        },
        LookupConfigs: {
          dev: {
            Hostname: 'localhost',
            Port: 6120,
          },
        },
        ModifierLookups: ['keepAlive'],
        ApplicationLookups: {
          apiProxy: {
            PathPattern: '/api-reqres*',
            Priority: 200,
            IsPrivate: true,
            IsTriggerSignIn: true,
          },
          docs: {
            PathPattern: '/docs/*',
            Priority: 200,
          },
          fathym: {
            PathPattern: '/fathym',
            Priority: 200,
          },
          home: {
            PathPattern: '/*',
            Priority: 100,
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
        LookupConfigs: {
          dev: {
            Hostname: 'localhost',
            Port: 6121,
          },
          denoDeploy: {
            Hostname: 'eac-runtime.deno.dev',
          },
          fathym: {
            Hostname: 'eac-runtime.fathym.com',
          },
        },
        ModifierLookups: ['keepAlive', 'oauth'],
        ApplicationLookups: {
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
          fathym: {
            PathPattern: '/fathym',
            Priority: 200,
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
          publicWebBlog: {
            PathPattern: '/blog*',
            Priority: 500,
          },
          profile: {
            PathPattern: '/profile/*',
            Priority: 500,
          },
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
          ProxyRoot: 'https://reqres.in/api',
        } as EaCProxyProcessor,
      },
      chat: {
        Details: {
          Name: 'Chat Site',
          Description: 'The chat used to display the main dashboard',
        },
        Processor: {
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
        ModifierLookups: ['css-js-img-cache'],
        Processor: {
          // ProxyRoot: 'http://localhost:8000',
          // ProxyRoot: 'http://localhost:5437',
          // ProxyRoot: 'https://dashboard.openbiotech.co',
          ProxyRoot: 'https://biotech-manager-web.azurewebsites.net',
          CacheControl: {
            'text\\/html': `private, max-age=${60 * 5}`,
            'image\\/': `public, max-age=${60 * 60 * 24 * 365}, immutable`,
            'application\\/javascript': `public, max-age=${
              60 * 60 * 24 * 365
            }, immutable`,
            'application\\/typescript': `public, max-age=${
              60 * 60 * 24 * 365
            }, immutable`,
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
          // Redirect: 'http://localhost:6121/deno/install.ts',
          Redirect: 'https://deno.land/x/fathym_eac_runtime/install.ts',
        } as EaCRedirectProcessor,
      },
      denoLocalInstall: {
        Details: {
          Name: 'EaC Runtime Local Deno Install',
          Description: 'A script to use for installing the deno runtime.',
        },
        // ModifierLookups: ['static-cache'],
        Processor: {
          DFS: {
            FileRoot: './',
          } as EaCLocalDistributedFileSystem,
        } as EaCDFSProcessor,
      },
      docs: {
        Details: {
          Name: 'Documentation Site',
          Description: 'The documentation site for the project',
        },
        Processor: {},
      },
      fathym: {
        Details: {
          Name: 'Fathym Redirect',
          Description: 'A redirect to Fathym',
        },
        Processor: {
          Redirect: 'https://www.fathym.com/',
        } as EaCRedirectProcessor,
      },
      fathymWhiteLogo: {
        Details: {
          Name: 'Standard Fathym White Logo',
          Description: 'The standard fathym white logo.',
        },
        ModifierLookups: ['static-cache'],
        Processor: {
          ProxyRoot: 'https://www.fathym.com/img/Fathym-logo-white-01.png',
          RedirectMode: 'follow',
        } as EaCProxyProcessor,
      },
      favicon: {
        Details: {
          Name: 'Standard Favicon',
          Description: 'The standard favicon',
        },
        ModifierLookups: ['static-cache'],
        Processor: {
          ProxyRoot: 'https://www.fathym.com/img/favicon.ico',
          RedirectMode: 'follow',
        } as EaCProxyProcessor,
      },
      home: {
        Details: {
          Name: 'Home Site',
          Description:
            'The home site to be used for the marketing of the project',
        },
        Processor: {},
      },
      oauth: {
        Details: {
          Name: 'OAuth Site',
          Description: 'The site for use in OAuth workflows for a user',
        },
        Processor: {
          ProviderLookup: 'adb2c',
        } as EaCOAuthProcessor,
      },
      profile: {
        Details: {
          Name: 'Profile Site',
          Description:
            'The site used to for user profile display and management',
        },
        Processor: {},
      },
      publicWebBlog: {
        Details: {
          Name: 'Public Web Blog Site',
          Description:
            'The public web blog site to be used for the marketing of the project',
        },
        ModifierLookups: ['static-cache'],
        Processor: {
          DFS: {
            DefaultFile: 'index.html',
            Package: '@lowcodeunit/public-web-blog',
            Version: 'latest',
          } as EaCNPMDistributedFileSystem,
          CacheControl: {
            'text\\/html': `private, max-age=${60 * 5}`,
            'image\\/': `public, max-age=${60 * 60 * 24 * 365}, immutable`,
            'application\\/javascript': `public, max-age=${
              60 * 60 * 24 * 365
            }, immutable`,
            'application\\/typescript': `public, max-age=${
              60 * 60 * 24 * 365
            }, immutable`,
            'text\\/css': `public, max-age=${60 * 60 * 24 * 365}, immutable`,
          },
        } as EaCDFSProcessor,
      },
    },
    Providers: {
      adb2c: {
        Details: {
          Name: 'Azure ADB2C OAuth Provider',
          Description:
            'The provider used to connect with our azure adb2c instance',
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
          Name: 'Local Cache',
          Description: 'The Deno KV database to use for local caching',
          DenoKVPath: Deno.env.get('LOCAL_CACHE_DENO_KV_PATH') || undefined,
          Type: 'DenoKV',
        } as EaCDenoKVDatabaseDetails,
      },
    },
    Modifiers: {
      keepAlive: {
        Details: {
          Name: 'Deno KV Cache',
          Description:
            'Lightweight cache to use that stores data in a DenoKV database.',
          KeepAlivePath: '/_eac/alive',
          Priority: 1000,
        } as EaCKeepAliveModifierDetails,
      },
      oauth: {
        Details: {
          Name: 'OAuth',
          Description: 'Used to restrict user access to various applications.',
          ProviderLookup: 'adb2c',
          SignInPath: '/oauth/signin',
          Priority: 1200,
        } as EaCOAuthModifierDetails,
      },
      'css-js-img-cache': {
        Details: {
          Name: 'CSS/JS/Image Cache',
          Description:
            'Lightweight cache to use that stores data in a DenoKV database for all css, js, and images.',
          DenoKVDatabaseLookup: 'cache',
          CacheSeconds: 60 * 20,
          PathFilterRegex: `^[^\\s]*(iconset\\/icons|\\.(apng|avif|bmp|cur|gif|ico|jfif|jpg|jpeg|pjpeg|pjp|png|svg|tiff|tif|webp|js|ts|css|))(\\?|#|$)`,
          Priority: 500,
        } as EaCDenoKVCacheModifierDetails,
      },
      'static-cache': {
        Details: {
          Name: 'Static Cache',
          Description:
            'Lightweight cache to use that stores data in a DenoKV database for static sites.',
          DenoKVDatabaseLookup: 'cache',
          CacheSeconds: 60 * 20,
          Priority: 500,
        } as EaCDenoKVCacheModifierDetails,
      },
      tracing: {
        Details: {
          Name: 'Deno KV Cache',
          Description:
            'Lightweight cache to use that stores data in a DenoKV database.',
          TraceRequest: true,
          TraceResponse: true,
          Priority: 1500,
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
              Description:
                'The Vector Store for interacting with Azure Search AI.',
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
});
