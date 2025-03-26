"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { EdgeFunctionCard } from "@/components/edge-functions/edge-function-card"
import { EdgeFunctionDetail } from "@/components/edge-functions/edge-function-detail"
import { Plus, Search } from "lucide-react"
import type { EdgeFunction } from "@/lib/types"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// モックデータ
const mockEdgeFunctions: EdgeFunction[] = [
  {
    id: "1",
    name: "ユーザー認証",
    slug: "auth",
    version: 1,
    status: "active",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
    entrypoint: "auth.ts",
    description: "ユーザー認証に関連する機能を提供します。",
  },
  {
    id: "2",
    name: "支払い処理",
    slug: "payment",
    version: 2,
    status: "active",
    created_at: "2023-02-01T00:00:00Z",
    updated_at: "2023-02-15T00:00:00Z",
    entrypoint: "payment.ts",
    description: "Stripeを使用した支払い処理を行います。",
  },
  {
    id: "3",
    name: "画像処理",
    slug: "image-processing",
    version: 1,
    status: "inactive",
    created_at: "2023-03-01T00:00:00Z",
    updated_at: "2023-03-01T00:00:00Z",
    entrypoint: "image.ts",
    description: "画像のリサイズや最適化を行います。",
  },
  {
    id: "4",
    name: "通知送信",
    slug: "notifications",
    version: 3,
    status: "error",
    created_at: "2023-04-01T00:00:00Z",
    updated_at: "2023-04-10T00:00:00Z",
    entrypoint: "notifications.ts",
    description: "プッシュ通知やメール通知を送信します。",
  },
]

export function EdgeFunctionsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFunction, setSelectedFunction] = useState<EdgeFunction | null>(null)
  const [activeTab, setActiveTab] = useState<string>("all")

  const filteredFunctions = mockEdgeFunctions.filter((fn) => {
    const matchesSearch =
      fn.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fn.description?.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "active") return matchesSearch && fn.status === "active"
    if (activeTab === "inactive") return matchesSearch && fn.status === "inactive"
    if (activeTab === "error") return matchesSearch && fn.status === "error"

    return matchesSearch
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">エッジ関数</h1>
          <p className="text-muted-foreground">Supabaseエッジ関数の一覧と詳細を確認できます。</p>
        </div>
        <Button className="w-full md:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          新規エッジ関数
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="w-full md:w-2/3 space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="エッジ関数を検索..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Tabs defaultValue="all" className="w-[400px]" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">すべて</TabsTrigger>
                <TabsTrigger value="active">アクティブ</TabsTrigger>
                <TabsTrigger value="inactive">非アクティブ</TabsTrigger>
                <TabsTrigger value="error">エラー</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {filteredFunctions.length > 0 ? (
              filteredFunctions.map((fn) => (
                <EdgeFunctionCard
                  key={fn.id}
                  edgeFunction={fn}
                  onClick={() => setSelectedFunction(fn)}
                  isSelected={selectedFunction?.id === fn.id}
                />
              ))
            ) : (
              <Card className="col-span-2">
                <CardContent className="pt-6 text-center">
                  <p>該当するエッジ関数が見つかりませんでした。</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="w-full md:w-1/3">
          {selectedFunction ? (
            <EdgeFunctionDetail edgeFunction={selectedFunction} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>エッジ関数の詳細</CardTitle>
                <CardDescription>左側のリストからエッジ関数を選択すると、詳細が表示されます。</CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

