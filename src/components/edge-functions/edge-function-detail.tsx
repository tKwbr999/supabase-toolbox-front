"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import type { EdgeFunction, EdgeFunctionDetail as EdgeFunctionDetailType } from "@/lib/types"
import { CheckCircle, Clock, Copy, Play, RefreshCw, XCircle } from "lucide-react"
import { EdgeFunctionExecutor } from "@/components/edge-functions/edge-function-executor"
import { cn } from "@/lib/utils"

// モックの詳細データ
const getMockDetail = (fn: EdgeFunction): EdgeFunctionDetailType => {
  return {
    ...fn,
    source_code: `import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  // CORS対応
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const { name } = await req.json()
    const data = {
      message: \`Hello \${name || "World"}!\`,
      timestamp: new Date().toISOString(),
    }

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})`,
    schema: {
      openapi: "3.0.0",
      info: {
        title: fn.name,
        version: `${fn.version}.0.0`,
        description: fn.description,
      },
      paths: {
        "/": {
          post: {
            summary: "メインエンドポイント",
            description: "このエッジ関数のメインエンドポイントです",
            operationId: "main",
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      name: {
                        type: "string",
                        description: "挨拶する相手の名前",
                      },
                    },
                  },
                  example: {
                    name: "Supabase",
                  },
                },
              },
            },
            responses: {
              "200": {
                description: "成功レスポンス",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        message: {
                          type: "string",
                        },
                        timestamp: {
                          type: "string",
                          format: "date-time",
                        },
                      },
                    },
                    example: {
                      message: "Hello Supabase!",
                      timestamp: "2023-04-01T12:00:00Z",
                    },
                  },
                },
              },
              "400": {
                description: "エラーレスポンス",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        error: {
                          type: "string",
                        },
                      },
                    },
                    example: {
                      error: "Invalid request",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  }
}

interface EdgeFunctionDetailProps {
  edgeFunction: EdgeFunction
}

export function EdgeFunctionDetail({ edgeFunction }: EdgeFunctionDetailProps) {
  const [detail, setDetail] = useState<EdgeFunctionDetailType>(() => getMockDetail(edgeFunction))
  const [isLoading, setIsLoading] = useState(false)

  const refreshDetail = () => {
    setIsLoading(true)
    // 実際のAPIコールをシミュレート
    setTimeout(() => {
      setDetail(getMockDetail(edgeFunction))
      setIsLoading(false)
    }, 1000)
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{edgeFunction.name}</CardTitle>
          <StatusBadge status={edgeFunction.status} />
        </div>
        <CardDescription>{edgeFunction.description || "説明がありません"}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-muted-foreground">スラッグ</div>
          <div>{edgeFunction.slug}</div>

          <div className="text-muted-foreground">バージョン</div>
          <div>v{edgeFunction.version}</div>

          <div className="text-muted-foreground">エントリーポイント</div>
          <div>{edgeFunction.entrypoint}</div>

          <div className="text-muted-foreground">作成日</div>
          <div>{formatDate(edgeFunction.created_at)}</div>

          <div className="text-muted-foreground">更新日</div>
          <div>{formatDate(edgeFunction.updated_at)}</div>
        </div>

        <Tabs defaultValue="execute">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="execute">実行</TabsTrigger>
            <TabsTrigger value="schema">スキーマ</TabsTrigger>
            <TabsTrigger value="code">コード</TabsTrigger>
          </TabsList>
          <TabsContent value="execute" className="space-y-4">
            <EdgeFunctionExecutor edgeFunction={detail} />
          </TabsContent>
          <TabsContent value="schema" className="space-y-4">
            {detail.schema ? (
              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <h3 className="font-medium">API情報</h3>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">タイトル</div>
                    <div>{detail.schema.info.title}</div>

                    <div className="text-muted-foreground">バージョン</div>
                    <div>{detail.schema.info.version}</div>

                    <div className="text-muted-foreground">説明</div>
                    <div>{detail.schema.info.description || "説明がありません"}</div>
                  </div>
                </div>

                {Object.entries(detail.schema.paths).map(([path, methods]) => (
                  <div key={path} className="rounded-md border">
                    <div className="border-b p-4">
                      <h3 className="font-medium">パス: {path}</h3>
                    </div>
                    {Object.entries(methods).map(([method, operation]) => (
                      <div key={method} className="p-4">
                        <div className="flex items-center gap-2">
                          <Badge className={cn("method-" + method.toLowerCase())}>{method.toUpperCase()}</Badge>
                          <span className="font-medium">{operation.summary}</span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{operation.description}</p>

                        {operation.requestBody && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium">リクエストボディ</h4>
                            <pre className="mt-2 rounded-md bg-muted p-4 text-xs overflow-auto">
                              {JSON.stringify(Object.values(operation.requestBody.content)[0].example, null, 2)}
                            </pre>
                          </div>
                        )}

                        {operation.responses && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium">レスポンス</h4>
                            {Object.entries(operation.responses).map(([status, response]) => (
                              <div key={status} className="mt-2">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">{status}</Badge>
                                  <span className="text-sm">{response.description}</span>
                                </div>
                                {response.content && (
                                  <pre className="mt-2 rounded-md bg-muted p-4 text-xs overflow-auto">
                                    {JSON.stringify(Object.values(response.content)[0].example, null, 2)}
                                  </pre>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center p-4 text-muted-foreground">スキーマ情報がありません</div>
            )}
          </TabsContent>
          <TabsContent value="code">
            {detail.source_code ? (
              <div className="relative">
                <pre className="rounded-md bg-muted p-4 text-xs overflow-auto">
                  <code>{detail.source_code}</code>
                </pre>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={() => {
                    navigator.clipboard.writeText(detail.source_code || "")
                  }}
                >
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">コードをコピー</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center p-4 text-muted-foreground">ソースコードがありません</div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={refreshDetail} disabled={isLoading}>
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              更新中...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              更新
            </>
          )}
        </Button>
        <Button size="sm">
          <Play className="mr-2 h-4 w-4" />
          実行
        </Button>
      </CardFooter>
    </Card>
  )
}

function StatusBadge({ status }: { status: EdgeFunction["status"] }) {
  if (status === "active") {
    return (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
        <CheckCircle className="mr-1 h-3 w-3" /> アクティブ
      </Badge>
    )
  }

  if (status === "inactive") {
    return (
      <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
        <Clock className="mr-1 h-3 w-3" /> 非アクティブ
      </Badge>
    )
  }

  return (
    <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
      <XCircle className="mr-1 h-3 w-3" /> エラー
    </Badge>
  )
}

