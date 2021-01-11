import { ObservableForm } from "@corets/form"

export type UseForm = <TValue extends object = any, TResult = any>(
  initialValue: FormInitializer<TValue, TResult>
) => ObservableForm<TValue, TResult>

export type CreateFormBinder = (form: ObservableForm) => ObservableFormBinder

export type FormBindingOptions = { validate?: boolean }
export type ButtonBindingOptions = {
  validate?: boolean
  disableOnSubmit?: boolean
}

export type SubmitBinding = { onSubmit: (e) => void }
export type SubmitButtonBinding = { onClick: (e) => void; disabled: boolean }
export type InputBinding = { onChange: (e) => void; value: any; name: string }
export type SelectBinding = { onChange: (e) => void; value: any; name: string }
export type CheckboxBinding = {
  onChange: (e) => void
  checked: any
  name: string
}
export type RadioBinding = { onChange: (e) => void; checked: any; name: string }
export type FormInitializer<TValue extends object, TResult> =
  | (() => ObservableForm<TValue, TResult>)
  | ObservableForm<TValue, TResult>

export interface ObservableFormBinder {
  form(options?: Partial<FormBindingOptions>): SubmitBinding
  button(options?: Partial<ButtonBindingOptions>): SubmitButtonBinding
  input(path?: string): InputBinding
  select(path?: string): SelectBinding
  checkbox(path?: string): CheckboxBinding
  radio(path?: string, directValue?: any): RadioBinding
}
