import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { cn } from "@/lib/utils"
const ChartContext = React.createContext<{ config: any } | null>(null)
function useChart() {
  const context = React.useContext(ChartContext)
  if (!context) throw new Error("useChart must be used within a ChartContainer")
  return context
}
const ChartContainer = React.forwardRef<HTMLDivElement, React.ComponentProps<"div"> & { config: any }>(({ id, className, children, config, ...props }, ref) => {
  const chartId = React.useId()
  return (
    <ChartContext.Provider value={{ config }}>
      <div id={id || chartId} ref={ref} className={cn("flex aspect-video justify-center text-xs", className)} {...props}>
        <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "ChartContainer"
const ChartTooltip = RechartsPrimitive.Tooltip
const ChartTooltipContent = React.forwardRef<HTMLDivElement, any>(({ active, payload, className, label, labelFormatter, labelClassName, formatter, color, hideLabel = false, hideIndicator = false, indicator = "dot", nameKey, labelKey }, ref) => {
  const { config } = useChart()
  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) return null
    const [item] = payload
    const key = `${labelKey || item.dataKey || item.name || "value"}`
    const itemConfig = config[key]
    const value = !labelKey && typeof label === "string" ? config[label]?.label || label : itemConfig?.label || label
    if (labelFormatter) return <div className={cn("font-medium", labelClassName)}>{labelFormatter(value, payload)}</div>
    if (!value) return null
    return <div className={cn("font-medium", labelClassName)}>{value}</div>
  }, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey])
  if (!active || !payload?.length) return null
  return (
    <div ref={ref} className={cn("grid min-w-[8rem] items-start gap-1.5 rounded-lg border bg-background px-2.5 py-1.5 text-xs shadow-xl", className)}>
      {tooltipLabel}
      <div className="grid gap-1.5">
        {(payload as any[]).map((item: any, index: number) => {
          const key = `${nameKey || item.name || item.dataKey || "value"}`
          const itemConfig = config[key]
          const indicatorColor = color || item.payload?.fill || item.color
          return (
            <div key={item.dataKey || index} className={cn("flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground")}>
              {formatter && item?.value !== undefined && item?.name ? (
                formatter(item.value, item.name, item, index, payload)
              ) : (
                <>
                  {itemConfig?.icon ? <itemConfig.icon /> : !hideIndicator && <div className={cn("shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]", indicator === "dot" ? "h-2.5 w-2.5" : "w-1")} style={{ "--color-bg": indicatorColor, "--color-border": indicatorColor } as React.CSSProperties} />}
                  <div className="flex flex-1 justify-between leading-none">
                    <div className="grid gap-1.5">
                      <span className="text-muted-foreground">{itemConfig?.label || item.name}</span>
                    </div>
                    <span className="font-mono font-medium tabular-nums text-foreground">
                      {item.value != null ? Number(item.value).toLocaleString() : item.value}
                    </span>
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
})
ChartTooltipContent.displayName = "ChartTooltipContent"
const ChartLegend = RechartsPrimitive.Legend
const ChartLegendContent = React.forwardRef<HTMLDivElement, any>(({ className, hideIcon = false, payload, verticalAlign = "bottom", nameKey }, ref) => {
  const { config } = useChart()
  if (!payload?.length) return null
  return (
    <div ref={ref} className={cn("flex items-center justify-center gap-4", verticalAlign === "top" ? "pb-3" : "pt-3", className)}>
      {(payload as any[]).map((item: any) => {
        const key = `${nameKey || item.dataKey || "value"}`
        const itemConfig = config[key]
        return (
          <div key={item.value} className={cn("flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground")}>
            {itemConfig?.icon && !hideIcon ? <itemConfig.icon /> : <div className="h-2 w-2 shrink-0 rounded-[2px]" style={{ backgroundColor: item.color }} />}
            {itemConfig?.label || item.value}
          </div>
        )
      })}
    </div>
  )
})
ChartLegendContent.displayName = "ChartLegendContent"
export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent }