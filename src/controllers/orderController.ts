import { Request, Response } from "express";
import prisma from "../config/database";
import { addEmailJob } from "../queues/emailQueue";

export const placeOrder = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { userDetails, products, shippingAddress } = req.body;

    // Basic validation
    if (!userDetails?.email || !products || products.length === 0) {
      res.status(400).json({
        message: "Invalid order data. Email and products are required.",
      });
      return;
    }

    const customerName =
      userDetails.firstName || userDetails.lastName
        ? `${userDetails.firstName || ""} ${userDetails.lastName || ""}`.trim()
        : "Valued Customer";

    // Fetch product details from DB to get accurate price and name
    const enrichedProducts = await Promise.all(
      products.map(async (item: { productId: string; quantity: number }) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }

        const priceToUse =
          product.salePrice && product.salePrice < product.price
            ? product.salePrice
            : product.price;

        return {
          name: product.name,
          quantity: item.quantity,
          price: priceToUse,
          total: priceToUse * item.quantity,
        };
      }),
    );

    const totalAmount = enrichedProducts.reduce(
      (sum: number, item: any) => sum + item.total,
      0,
    );

    // 2. Add email job to queue
    await addEmailJob("send-order-email", {
      email: userDetails.email,
      orderDetails: {
        name: customerName,
        email: userDetails.email,
        phone: userDetails.phone || shippingAddress.phone,
        items: enrichedProducts,
        total: totalAmount,
        shippingAddress: shippingAddress || {},
        orderId: "temp-" + Date.now(), // Placeholder ID
        userDetails: userDetails, // Pass all user details just in case
      },
    });

    res.status(201).json({
      message:
        "Order placed successfully, confirmation email will be sent shortly.",
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
