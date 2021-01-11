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

      return <h1>{form.values.get().foo}</h1>
    }

    const wrapper = mount(<Test />)
    const target = () => wrapper.find("h1")

    expect(target().text()).toBe("bar")
  })

  it("uses form with initializer", () => {
    const initializer = () => createForm({ foo: "bar" })

    const Test = () => {
      const form = useForm(initializer)

      return <h1>{form.values.get().foo}</h1>
    }

    const wrapper = mount(<Test />)
    const target = () => wrapper.find("h1")

    expect(target().text()).toBe("bar")
  })

  it("hooks all form state", () => {
    const form = createForm({ foo: "bar" }).configure({
      validateOnChange: false,
    })
    let changes = 0

    const Test = () => {
      changes++
      useForm(form)

      return (
        <h1>
          {JSON.stringify(form.values.get())},
          {form.errors.get() === undefined
            ? "undefined"
            : JSON.stringify(form.errors.get())}
          ,{JSON.stringify(form.submitting.get())},
          {JSON.stringify(form.submitted.get())},
          {JSON.stringify(form.dirtyFields.get())},
          {JSON.stringify(form.changedFields.get())}
        </h1>
      )
    }

    const wrapper = mount(<Test />)
    const target = () => wrapper.find("h1")

    expect(changes).toBe(1)
    expect(target().text()).toBe(`{"foo":"bar"},undefined,false,false,[],[]`)

    act(() => form.errors.set({ field: ["error"] }))

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

    act(() => form.dirtyFields.add("field1"))

    expect(changes).toBe(5)
    expect(target().text()).toBe(
      `{"foo":"bar"},{"field":["error"]},true,true,["field1"],[]`
    )

    act(() => form.changedFields.add("field2"))

    expect(changes).toBe(6)
    expect(target().text()).toBe(
      `{"foo":"bar"},{"field":["error"]},true,true,["field1"],["field2"]`
    )

    act(() => form.values.setAt("foo", "yolo"))

    expect(changes).toBe(7)
    expect(target().text()).toBe(
      `{"foo":"yolo"},{"field":["error"]},true,true,["field1","foo"],["field2","foo"]`
    )
  })
})
