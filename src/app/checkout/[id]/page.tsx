import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { getOrderById } from "@/lib/actions/order.actions";
import Stripe from "stripe";
import PaymentForm from "./payment-form";

export const metadata = {
  title: "Payment",
};

const CheckoutPaymentPage = async (props: {
  params: Promise<{
    id: string;
  }>;
}) => {
  const params = await props.params;

  let client_secret = null;
  const { id } = params;

  const order = await getOrderById(id);
  if (!order) notFound();

  if (order.paymentMethod === "Stripe" && !order.isPaid) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100),
      currency: "USD",
      metadata: { orderId: order._id },
    });
    client_secret = paymentIntent.client_secret;
  }

  const session = await auth();

  return (
    <PaymentForm
      clientSecret={client_secret}
      order={order}
      paypalClientId={process.env.PAYPAL_CLIENT_ID || "sb"}
      isAdmin={session?.user?.role === "Admin" || false}
    />
  );
};

export default CheckoutPaymentPage;
