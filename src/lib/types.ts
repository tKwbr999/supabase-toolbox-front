export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"

export interface EdgeFunction {
  id: string
  name: string
  slug: string
  version: number
  status: "active" | "inactive" | "error"
  created_at: string
  updated_at: string
  entrypoint: string
  description?: string
}

export interface EdgeFunctionDetail extends EdgeFunction {
  schema?: OpenAPISchema
  source_code?: string
}

export interface OpenAPISchema {
  openapi: string
  info: {
    title: string
    version: string
    description?: string
  }
  paths: Record<string, Record<string, PathItem>>
}

export interface PathItem {
  summary?: string
  description?: string
  operationId?: string
  parameters?: Parameter[]
  requestBody?: RequestBody
  responses?: Record<string, Response>
}

export interface Parameter {
  name: string
  in: "query" | "header" | "path" | "cookie"
  description?: string
  required?: boolean
  schema?: SchemaObject
}

export interface RequestBody {
  description?: string
  required?: boolean
  content: Record<string, MediaType>
}

export interface MediaType {
  schema?: SchemaObject
  example?: any
}

export interface Response {
  description: string
  content?: Record<string, MediaType>
}

export interface SchemaObject {
  type?: string
  format?: string
  properties?: Record<string, SchemaObject>
  items?: SchemaObject
  required?: string[]
  enum?: string[]
  default?: any
  description?: string
}

export interface ExecutionResult {
  status: number
  statusText: string
  headers: Record<string, string>
  data: any
  duration: number
}

