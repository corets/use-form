import { UseForm } from "./types"
import { useEffect, useMemo, useState } from "react"

export const useForm: UseForm = (initialValue, deps = []) => {
  const form = useMemo(
    () => (typeof initialValue === "function" ? initialValue() : initialValue),
    deps
  )

  const [reference, setReference] = useState(0)

  useEffect(() => {
    return form.listen(() => setReference((previous) => previous + 1))
  }, deps)

  return form
}
