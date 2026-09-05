import React, {useEffect, useState} from 'react';
import InstallToolsDialog from '@site/src/components/docs/InstallToolsDialog';

/**
 * Lets anything on the page open the Install tools pop-up without knowing
 * where the dialog is mounted, which is the same arrangement `AskAiBridge`
 * makes for the assistant panel, pointed the other way.
 *
 * Dispatch `window.dispatchEvent(new CustomEvent('abdm:install-tools', {
 * cancelable: true}))` and this opens it. The listener calls preventDefault,
 * so a caller can tell whether a host was listening: `dispatchEvent` returns
 * false when it was. The assistant panel uses that to fall back to the Build
 * with AI page when it is embedded somewhere this bridge is not mounted.
 *
 * `PageActions` keeps its own copy of the dialog for the Install tools button
 * in the page header. Two dialogs never open at once in practice, because
 * each is driven by its own control, and sharing one would mean lifting state
 * into a context for a pop-up that is opened from two places.
 */
export default function InstallToolsBridge(): React.ReactNode {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handle = (event: Event) => {
      event.preventDefault();
      setOpen(true);
    };
    window.addEventListener('abdm:install-tools', handle);
    return () => window.removeEventListener('abdm:install-tools', handle);
  }, []);

  return <InstallToolsDialog open={open} onOpenChange={setOpen} />;
}
