import dotenv from "dotenv";
dotenv.config();
import Stripe from "stripe";

(async () => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const product = await stripe.products.create({
      name: "Regal Pet Portrait",
      description: "Custom pet portrait order (test)",
    });
    const price = await stripe.prices.create({
      currency: "usd",
      unit_amount: 4900,
      product: product.id,
    });
    console.log(price.id);
  } catch (e) {
    console.error("STRIPE_ERROR", e);
    process.exitCode = 1;
  }
})();