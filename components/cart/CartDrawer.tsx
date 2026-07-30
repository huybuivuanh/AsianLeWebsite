"use client";

import { useEffect, useState } from "react";
import {
  useCartStore,
  cartItemCount,
  cartSubtotal,
} from "@/lib/cartStore";
import CartTriggerButton from "@/components/cart/CartTriggerButton";
import CartDrawerPanel from "@/components/cart/CartDrawerPanel";

export default function CartDrawer() {
  const [open, setOpen] = useState(false);
  const lines = useCartStore((s) => s.lines);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeLine = useCartStore((s) => s.removeLine);

  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  const itemCount = cartItemCount(lines);
  const subtotal = cartSubtotal(lines);

  return (
    <>
      <CartTriggerButton
        itemCount={itemCount}
        subtotal={subtotal}
        onClick={() => setOpen(true)}
      />
      <CartDrawerPanel
        open={open}
        onClose={() => setOpen(false)}
        lines={lines}
        subtotal={subtotal}
        updateQuantity={updateQuantity}
        removeLine={removeLine}
      />
    </>
  );
}
