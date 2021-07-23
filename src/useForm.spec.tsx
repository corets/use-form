import React from "react"
import { useForm } from "./index"
import { createForm } from "@corets/form"
import { act, render, screen } from "@testing-library/react"

describe("useForm", () => {
  it("uses form", () => {
    const initializer = createForm({ foo: "bar" })

    const Test = () => {
      const form = useForm(initializer)

      return <h1>{form.getAt("foo")}</h1>
    }

    render(<Test/>)

    const target = screen.getByRole("heading")

    expect(target).toHaveTextContent("bar")
  })

  it("uses form with initializer", () => {
    const initializer = () => createForm({ foo: "bar" })

    const Test = () => {
      const form = useForm(initializer)

      return <h1>{form.getAt("foo")}</h1>
    }

    render(<Test/>)

    const target = screen.getByRole("heading")

    expect(target).toHaveTextContent("bar")
  })

  it("hooks all form state", async () => {
    const form = createForm({ foo: "bar" }).configure({
      reactive: false,
      debounce: 0,
    })
    let changes = 0

    const Test = () => {
      changes++
      useForm(form)

      return (
        <h1>
          {JSON.stringify(form.get())},
          {form.getErrors() === undefined
            ? "undefined"
            : JSON.stringify(form.getErrors())}
          ,{JSON.stringify(form.isSubmitting())},
          {JSON.stringify(form.isSubmitted())},
          {JSON.stringify(form.getDirty())},
          {JSON.stringify(form.getChanged())}
        </h1>
      )
    }

    render(<Test/>)

    const target = screen.getByRole("heading")

    expect(changes).toBe(1)
    expect(target).toHaveTextContent(`{"foo":"bar"},undefined,false,false,[],[]`)

    act(() => form.setErrors({ field: ["error"] }))

    expect(changes).toBe(2)
    expect(target).toHaveTextContent(
      `{"foo":"bar"},{"field":["error"]},false,false,[],[]`
    )

    act(() => form.setIsSubmitting(true))

    expect(changes).toBe(3)
    expect(target).toHaveTextContent(
      `{"foo":"bar"},{"field":["error"]},true,false,[],[]`
    )

    act(() => form.setIsSubmitted(true))

    expect(changes).toBe(4)
    expect(target).toHaveTextContent(
      `{"foo":"bar"},{"field":["error"]},true,true,[],[]`
    )

    act(() => form.addDirtyAt("field1"))

    expect(changes).toBe(5)
    expect(target).toHaveTextContent(
      `{"foo":"bar"},{"field":["error"]},true,true,["field1"],[]`
    )

    act(() => form.addChangedAt("field2"))

    expect(changes).toBe(6)
    expect(target).toHaveTextContent(
      `{"foo":"bar"},{"field":["error"]},true,true,["field1"],["field2"]`
    )

    act(() => form.setAt("foo", "yolo"))

    expect(changes).toBe(7)
    expect(target).toHaveTextContent(
      `{"foo":"yolo"},{"field":["error"]},true,true,["field1","foo"],["field2","foo"]`
    )
  })
})
