"use client"

import type React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Types for the universal table
export interface TableColumn<T> {
  key: string
  header: string
  accessor?: keyof T | ((item: T) => any)
  render?: (value: any, item: T, index: number) => React.ReactNode
  className?: string
  headerClassName?: string
}

type MaybeFn<R, T> = R | ((item: T, index: number) => R)

export interface TableAction<T> {
  label: MaybeFn<React.ReactNode, T>
  onClick: (item: T, index: number) => void
  variant?: MaybeFn<"default" | "destructive" | "outline" | "secondary" | "ghost" | "link", T>
  size?: MaybeFn<"default" | "sm" | "lg" | "icon", T>
  className?: MaybeFn<string, T>
  disabled?: MaybeFn<boolean, T>
  icon?: MaybeFn<React.ReactNode, T>
}

export interface UniversalTableProps<T> {
  title?: string
  description?: string
  data: T[]
  columns: TableColumn<T>[]
  actions?: TableAction<T>[]
  loading?: boolean
  emptyMessage?: string
  className?: string
  showCard?: boolean
  onRowClick?: (item: T, index: number) => void
}

// Helper components for common cell types
export const TableBadge = ({
  children,
  variant = "default",
}: {
  children: React.ReactNode
  variant?: "default" | "secondary" | "destructive" | "outline"
}) => <Badge variant={variant}>{children}</Badge>

export const TableAvatar = ({
  src,
  fallback,
  name,
  email,
}: {
  src?: string
  fallback: string
  name?: string
  email?: string
}) => (
  <div className="flex items-center gap-3">
    <Avatar>
      <AvatarImage src={src || "/placeholder.svg"} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
    {(name || email) && (
      <div>
        {name && <div className="font-medium">{name}</div>}
        {email && <div className="text-xs text-slate-500">{email}</div>}
      </div>
    )}
  </div>
)

// Loading skeleton component
const TableSkeleton = ({ columns }: { columns: TableColumn<any>[] }) => (
  <div className="flex justify-center py-6">
    <div className="animate-pulse w-full space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex space-x-4">
          {columns.map((_, j) => (
            <div key={j} className="h-4 bg-slate-200 rounded flex-1"></div>
          ))}
        </div>
      ))}
    </div>
  </div>
)
export function UniversalTable<T extends Record<string, any>>({
  title,
  description,
  data,
  columns,
  actions = [],
  loading = false,
  emptyMessage = "No data available",
  className = "",
  showCard = true,
  onRowClick,
}: UniversalTableProps<T>) {
  const getValue = (item: T, column: TableColumn<T>) => {
    if (column.accessor) {
      if (typeof column.accessor === "function") {
        return column.accessor(item)
      }
      return item[column.accessor]
    }
    return item[column.key as keyof T]
  }

  const TableContent = () => (
    <>
      {loading ? (
        <TableSkeleton columns={columns} />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className={column.headerClassName}>
                  {column.header}
                </TableHead>
              ))}
              {actions.length > 0 && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                  className="text-center py-8 text-slate-500"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, index) => (
                <TableRow
                  key={index}
                  className={onRowClick ? "cursor-pointer hover:bg-slate-50" : ""}
                  onClick={() => onRowClick?.(item, index)}
                >
                  {columns.map((column) => {
                    const value = getValue(item, column)
                    return (
                      <TableCell key={column.key} className={column.className}>
                        {column.render ? column.render(value, item, index) : value}
                      </TableCell>
                    )
                  })}
                  {actions.length > 0 && (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {actions.map((action, actionIndex) => {
                          const label = typeof action.label === "function" ? action.label(item, index) : action.label

                          const variant =
                            typeof action.variant === "function"
                              ? action.variant(item, index)
                              : (action.variant ?? "outline")

                          const size = typeof action.size === "function" ? action.size(item, index) : action.size

                          const className =
                            typeof action.className === "function" ? action.className(item, index) : action.className

                          const isDisabled =
                            typeof action.disabled === "function" ? action.disabled(item, index) : action.disabled

                          const icon = typeof action.icon === "function" ? action.icon(item, index) : action.icon
                          return (
                            <Button
                              key={actionIndex}
                              variant={variant}
                              size={size || "sm"}
                              className={className}
                              disabled={isDisabled}
                              onClick={(e) => {
                                e.stopPropagation()
                                action.onClick(item, index)
                              }}
                            >
                              {icon && <span className="mr-1">{icon}</span>}
                              {label}
                            </Button>
                          )
                        })}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </>
  )

  if (!showCard) {
    return (
      <div className={className}>
        <TableContent />
      </div>
    )
  }

  return (
    <Card className={className}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        <TableContent />
      </CardContent>
    </Card>
  )
}
