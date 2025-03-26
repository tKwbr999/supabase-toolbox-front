"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import type { EdgeFunction } from "@/lib/types"
import { ArrowRight, CheckCircle, Clock, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface EdgeFunctionCardProps {
  edgeFunction: EdgeFunction
  onClick: () => void
  isSelected: boolean
}

export function EdgeFunctionCard({ edgeFunction, onClick, isSelected }: EdgeFunctionCardProps) {
  return (
    <Card
      className={cn("cursor-pointer transition-all hover:border-primary/50", isSelected && "border-primary")}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{edgeFunction.name}</CardTitle>
          <StatusBadge status={edgeFunction.status} />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">{edgeFunction.description || "説明がありません"}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge variant="outline">v{edgeFunction.version}</Badge>
          <Badge variant="outline">{edgeFunction.slug}</Badge>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <div className="text-xs text-muted-foreground">更新: {formatDate(edgeFunction.updated_at)}</div>
        <Button variant="ghost" size="sm" className="gap-1">
          詳細 <ArrowRight className="h-3 w-3" />
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

