import { Observable, useEffect } from "voby"

function Modal({
  id,
  show,
  children,
  ...props
}: JSX.VoidHTMLAttributes<HTMLDialogElement> & {
  id: string
  show?: Observable<boolean>
  children: JSX.Children
}): JSX.Element {
  useEffect(() => {
    if (!show) return
    const shouldShow = show()
    const dialog = document.getElementById(id)
    if (!(dialog instanceof HTMLDialogElement))
      throw new Error("Expected a dialog element")
    shouldShow ? dialog.showModal() : dialog.close()
  })
  useEffect(() => {
    const dialog = document.getElementById(id)
    if (!(dialog instanceof HTMLDialogElement))
      throw new Error("Expected a dialog element")
    dialog.addEventListener("close", () => {
      show?.(false)
    })
  })
  return (
    <dialog {...props} id={id} class={["modal", "z-[10000]", props.class]}>
      <div class="modal-box w-11/12 max-w-5xl">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        {children}
      </div>
    </dialog>
  )
}

export default Modal
