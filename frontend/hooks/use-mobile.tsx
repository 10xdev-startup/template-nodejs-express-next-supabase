import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Inicia como `undefined` para que server e primeira renderização do client
  // sejam idênticos (sem ler `window` durante o render). O valor real é definido
  // no effect, após a hidratação — evita branch server/client e hydration mismatch.
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
