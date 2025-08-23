import { Observable, useEffect } from "voby"

function Modal(
  props: JSX.VoidHTMLAttributes<HTMLDialogElement> & {
    id: string
    show?: Observable<boolean>
    children: JSX.Children
  }
): JSX.Element {
  useEffect(() => {
    if (!props.show) return
    const shouldShow = props.show()
    const dialog = document.getElementById(props.id)
    if (!(dialog instanceof HTMLDialogElement))
      throw new Error("Expected a dialog element")
    shouldShow ? dialog.showModal() : dialog.close()
  })
  return (
    <dialog {...props} id={props.id} class={["modal", props.class]}>
      <div class="modal-box w-11/12 max-w-5xl">{props.children}</div>
    </dialog>
  )
}

export default Modal
