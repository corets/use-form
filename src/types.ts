import { ObservableForm } from "@corets/form"

export type FormInitializer<TValue extends object, TResult> =
  | (() => ObservableForm<TValue, TResult>)
  | ObservableForm<TValue, TResult>

export type UseForm = <TValue extends object = any, TResult = any>(
  initialValue: FormInitializer<TValue, TResult>
) => ObservableForm<TValue, TResult>
