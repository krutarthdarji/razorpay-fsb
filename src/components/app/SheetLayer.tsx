import { createContext, useContext, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Pages slide in their own layer, so a sheet rendered inside a page can't rise
 * above the BottomNav. Sheets render here instead: a layer after the nav.
 */
const SheetHostContext = createContext<HTMLElement | null>(null);

export function SheetHost({ children }: { children: React.ReactNode }) {
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  return (
    <SheetHostContext.Provider value={host}>
      {children}
      <div ref={setHost} />
    </SheetHostContext.Provider>
  );
}

/** Renders a sheet into the SheetHost layer (or in place when there is no host, e.g. previews) */
export function SheetPortal({ children }: { children: React.ReactNode }) {
  const host = useContext(SheetHostContext);
  return host ? createPortal(children, host) : <>{children}</>;
}
