import { observer } from "mobx-react-lite"
import { useEffect } from "react"

/**
 * Ensures we have a mnemonic
 */
export const WalletProvider = observer(function WalletProvider({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    console.log("initializing wallet")
  }, [])
  return <>
    {children}
  </>
})
