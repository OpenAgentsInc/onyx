import "./scrl/global.scss"
import { typography } from "@/theme"
import Card from "./scrl/Card"

export function Test() {
  return (
    <div style={{ color: "white", fontFamily: typography.primary.medium }}>
      <Card title="heyyyy" mode="left">
        <div>Test</div>
      </Card>
    </div>
  )
}
