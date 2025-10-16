import { ReactNode } from "react";

interface ModalProps {
  show: boolean;
  title?: string;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
}

export default function Modal({
  show,
  title,
  onClose,
  children,
  maxWidth = "max-w-2xl",
}: ModalProps) {
  return (
    <dialog className={`modal ${show ? "modal-open" : ""}`}>
      <div className={`modal-box ${maxWidth} max-h-[80vh] overflow-y-auto`}>
        {title && (
          <h3 className="font-bold text-lg border-b pb-2 mb-3 text-gray-800">
            {title}
          </h3>
        )}
        <div className="py-2">{children}</div>
      </div>

      {/* Background click close */}
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}