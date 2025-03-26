"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { EdgeFunctionDetail, ExecutionResult } from "@/lib/types"
import { AlertCircle, Copy, Play } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface EdgeFunctionExecutorProps {
  edgeFunction: EdgeFunctionDetail
}

export function EdgeFunctionExecutor({ edgeFunction }: EdgeFunctionExecutorProps) {
  const [url, setUrl] = useState(`https://example.com/functions/v1/${edgeFunction.slug}`)
  const [method, setMethod] = useState<string>("POST")
  const [headers, setHeaders] = useState<string>('{\n  "Content-Type": "application/json"\n}')
  const [body, setBody] = useState<string>('{\n  "name": "Supabase"\n}')
  const [isExecuting, setIsExecuting] = useState(false)
  const [result, setResult] = useState<ExecutionResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const executeFunction = () => {
    setIsExecuting(true)
    setError(null)

    // 実際のAPIコールをシミュレート
    setTimeout(() => {
      try {
        const parsedBody = JSON.parse(body)

        // 成功レスポンスをシミュレート
        setResult({
          status: 200,
          statusText: "OK",
          headers: {
            "content-type": "application/json",
            "access-control-allow-origin": "*",
          },
          data: {
            message: `Hello ${parsedBody.name || "World"}!`,
            timestamp: new Date().toISOString(),
          },
          duration: 235, // ミリ秒
        })
      } catch (err) {
        setError("リクエストボディのJSONが無効です: " + err.message)
      } finally {
        setIsExecuting(false)
      }
    }, 1000)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="url">URL</Label>
        <div className="flex gap-2">
          <div className="w-24">
            <select
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
              <option value="PATCH">PATCH</option>
            </select>
          </div>
          <Input id="url" value={url} onChange={(e) => setUrl(e.target.value)} className="flex-1" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="headers">ヘッダー</Label>
        <Textarea
          id="headers"
          value={headers}
          onChange={(e) => setHeaders(e.target.value)}
          className="font-mono text-sm"
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="body">リクエストボディ</Label>
        <Textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="font-mono text-sm"
          rows={6}
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>エラー</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button onClick={executeFunction} disabled={isExecuting} className="w-full">
        {isExecuting ? (
          <>実行中...</>
        ) : (
          <>
            <Play className="mr-2 h-4 w-4" />
            エッジ関数を実行
          </>
        )}
      </Button>

      {result && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">実行結果</CardTitle>
              <div className="flex items-center gap-2">
                <Badge
                  className={cn(
                    result.status >= 200 && result.status < 300
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
                  )}
                >
                  {result.status} {result.statusText}
                </Badge>
                <Badge variant="outline">{result.duration}ms</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="response">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="response">レスポンス</TabsTrigger>
                <TabsTrigger value="headers">ヘッダー</TabsTrigger>
              </TabsList>
              <TabsContent value="response" className="space-y-4">
                <div className="relative">
                  <pre className="mt-2 rounded-md bg-muted p-4 text-xs overflow-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(result.data, null, 2))
                    }}
                  >
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">レスポンスをコピー</span>
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="headers">
                <div className="space-y-2">
                  {Object.entries(result.headers).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-2 gap-2 text-sm">
                      <div className="font-medium">{key}</div>
                      <div>{value}</div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

