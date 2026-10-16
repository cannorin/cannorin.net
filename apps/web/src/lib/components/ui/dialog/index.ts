import { Dialog as DialogPrimitive } from "bits-ui";

import Content from "./dialog-content.svelte";
import Description from "./dialog-description.svelte";
import Footer from "./dialog-footer.svelte";
import Header from "./dialog-header.svelte";
import Overlay from "./dialog-overlay.svelte";
import Title from "./dialog-title.svelte";

const Root: typeof DialogPrimitive.Root = DialogPrimitive.Root;
const Trigger: typeof DialogPrimitive.Trigger = DialogPrimitive.Trigger;
const Close: typeof DialogPrimitive.Close = DialogPrimitive.Close;
const Portal: typeof DialogPrimitive.Portal = DialogPrimitive.Portal;

export {
  Close,
  Close as DialogClose,
  Content,
  Content as DialogContent,
  Description,
  Description as DialogDescription,
  Footer,
  Footer as DialogFooter,
  Header,
  Header as DialogHeader,
  Overlay,
  Overlay as DialogOverlay,
  Portal,
  Portal as DialogPortal,
  Root,
  //
  Root as Dialog,
  Title,
  Title as DialogTitle,
  Trigger,
  Trigger as DialogTrigger,
};
