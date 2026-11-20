import { OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi'
import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'

export type ApiDocConfig = {
  title: string
  version: string
  description?: string
  servers?: Array<{ url: string; description?: string }>
}

export function generateOpenApiDocument(registry: OpenAPIRegistry, config: ApiDocConfig) {
  const generator = new OpenApiGeneratorV31(registry.definitions)

  return generator.generateDocument({
    openapi: '3.1.0',
    info: {
      title: config.title,
      version: config.version,
      description: config.description,
    },
    servers: config.servers ?? [{ url: '/api/v1', description: 'API v1' }],
    tags: [],
  })
}
