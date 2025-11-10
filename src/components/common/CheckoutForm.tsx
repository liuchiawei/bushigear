import React from "react";
import { useCheckout } from "@stripe/react-stripe-js/checkout";

export default function CheckoutForm() {
  const checkoutState = useCheckout();
  switch (checkoutState.type) {
    case "loading":
      return <div>Loading ...</div>;
    case "error":
      return <div>Error: {checkoutState.error.message}</div>;
    case "success":
      return (
        <pre>
          {JSON.stringify(checkoutState.checkout.lineItems, null, 2)}
          // A formatted total amount Total:{" "}
          {checkoutState.checkout.total.total.amount}
        </pre>
      );
  }
}
