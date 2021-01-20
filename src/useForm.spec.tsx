import React from "react"
import { useForm } from "./index"
import { mount } from "enzyme"
import { createForm } from "@corets/form"
import { act } from "react-dom/test-utils"

describe("useForm", () => {
  it("uses form", () => {
    const initializer = createForm({ foo: "bar" })

    const Test = () => {
      const form = useForm(initializer)

      return <h1>{form.getAt("foo")}</h1>
    }

    const wrapper = mount(<Test />)
    const target = () => wrapper.find("h1")

    expect(target().text()).toBe("bar")
  })

  it("uses form with initializer", () => {
    const initializer = () => createForm({ foo: "bar" })

    const Test = () => {
      const form = useForm(initializer)

      return <h1>{form.getAt("foo")}</h1>
    }

    const wrapper = mount(<Test />)
    const target = () => wrapper.find("h1")

    expect(target().text()).toBe("bar")
  })

  it("hooks all form state", async () => {
    const form = createForm({ foo: "bar" }).configure({
      validateOnChange: false,
      debounceChanges: 0,
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
          {JSON.stringify(form.getDirtyFields())},
          {JSON.stringify(form.getChangedFields())}
        </h1>
      )
    }

    const wrapper = mount(<Test />)
    const target = () => wrapper.find("h1")

    expect(changes).toBe(1)
    expect(target().text()).toBe(`{"foo":"bar"},undefined,false,false,[],[]`)

    act(() => form.setErrors({ field: ["error"] }))

    expect(changes).toBe(2)
    expect(target().text()).toBe(
      `{"foo":"bar"},{"field":["error"]},false,false,[],[]`
    )

    act(() => form.submitting.set(true))

    expect(changes).toBe(3)
    expect(target().text()).toBe(
      `{"foo":"bar"},{"field":["error"]},true,false,[],[]`
    )

    act(() => form.submitted.set(true))

    expect(changes).toBe(4)
    expect(target().text()).toBe(
      `{"foo":"bar"},{"field":["error"]},true,true,[],[]`
    )

    act(() => form.addDirtyFields("field1"))

    expect(changes).toBe(5)
    expect(target().text()).toBe(
      `{"foo":"bar"},{"field":["error"]},true,true,["field1"],[]`
    )

    act(() => form.addChangedFields("field2"))

    expect(changes).toBe(6)
    expect(target().text()).toBe(
      `{"foo":"bar"},{"field":["error"]},true,true,["field1"],["field2"]`
    )

    act(() => form.setAt("foo", "yolo"))

    expect(changes).toBe(7)
    expect(target().text()).toBe(
      `{"foo":"yolo"},{"field":["error"]},true,true,["field1","foo"],["field2","foo"]`
    )
  })
})
