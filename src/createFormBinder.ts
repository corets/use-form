import { CreateFormBinder } from "./types"
import { FormBinder } from "./FormBinder"

export const createFormBinder: CreateFormBinder = (form) => new FormBinder(form)
