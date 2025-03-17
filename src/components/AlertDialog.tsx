import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { createContext, useContext, useState, ReactNode } from "react";

const AlertContext = createContext<(message: string, onClose?: () => void) => void>(() => {});

export function AlertProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [onCloseCallback, setOnCloseCallback] = useState<(() => void) | undefined>();

  const showAlert = (msg: string, onClose?: () => void) => {
    setMessage(msg);
    setIsOpen(true);
    setOnCloseCallback(() => onClose);
  };

  const closeDialog = () => {
    setIsOpen(false);
    if (onCloseCallback) onCloseCallback();
  };

  return (
    <AlertContext.Provider value={showAlert}>
      {children}
      <Dialog open={isOpen} as="div" className="relative z-10" onClose={closeDialog}>
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel
            className="w-full max-w-sm rounded-xl bg-[#231136] p-6 border border-[#c4b5fd]/10 shadow-lg 
                      transform transition-all duration-300 ease-out data-[closed]:opacity-0 scale-95"
          >
            <DialogTitle as="h3" className="text-xl font-semibold text-[#c4b5fd]">
              Atención
            </DialogTitle>
            <p className="mt-3 text-md text-white/80">{message}</p>

            <div className="mt-8 flex justify-end">
              <button
                onClick={closeDialog}
                className="cursor-pointer px-4 py-2 text-md font-medium text-[#c4b5fd] bg-[#2a1b3e] 
                           rounded-md transition hover:bg-[#341d4e] border border-[#c4b5fd]/20"
              >
                Aceptar
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </AlertContext.Provider>
  );
}

export function useAlert() {
  return useContext(AlertContext);
}
