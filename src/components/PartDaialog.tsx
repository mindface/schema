import { ReactNode, useRef, forwardRef, ForwardRefRenderFunction, useImperativeHandle } from "react";
import { ReadEnto } from "../types/readEnto";

type Props = {
  sendAction?: () => void;
  openView?: boolean;
  title?: string;
  children?: ReactNode;
  openText?: string;
}

export interface PropsRef {
  open:() => void
}

const _PartDaialog:ForwardRefRenderFunction<PropsRef,Props> = (props, ref) => {
  const dialog = useRef<HTMLDialogElement>(null);

  const openAction = () => {
    dialog.current?.showModal();
  }

  const closedAction = () => {
    dialog.current?.close();
  }

  useImperativeHandle(ref, () => ({
    open() {
      dialog.current?.showModal();
    }
  }))

  return (
    <div className="dialog-area">
      { props.openView && <button className="btn" onClick={openAction}>{props.openText ?? "open"}</button>}
      <dialog className="dialog" id="dialog" ref={dialog}>
        {props.title && <h3 className="title">{props.title}</h3>}
        {props.children && props.children}
        <menu>
          <button className="btn" onClick={closedAction}>close</button>
          {/* <button onClick={props.sendAction}>sned</button> */}
        </menu>
      </dialog>
    </div>
  )
}

export const PartDaialog = forwardRef(_PartDaialog)