import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendResetEmail = async (email: string, resetLink: string) => {
  const { data, error } = await resend.emails.send({
    from: "Cosmo Crystals <noreply@cosmocrystals.com>",
    to: email,
    cc: "cosmocrystalsshop@gmail.com",
    subject: "Reset your password",
    html: `<!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Reset Your Password - Cosmo Crystals</title>
              <style>
                /* Base styles */
                body {
                  margin: 0;
                  padding: 0;
                  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  background-color: #f7f7f7;
                }
                
                /* Container styles */
                .email-container {
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #ffffff;
                  overflow: hidden;
                  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
                }
                
                /* Header styles with luxury feel */
                .header {
                  background: #b23a48;
                  padding: 0;
                  position: relative;
                  overflow: hidden;
                }
                
                .header-overlay {
                  position: relative;
                  padding: 40px 0 60px;
                  text-align: center;
                  z-index: 2;
                }
                
                .header-background {
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  opacity: 0.15;
                  z-index: 1;
                  background-image: url('/api/placeholder/600/300');
                  background-size: cover;
                  background-position: center;
                }
                
                .logo-container {
                  margin-bottom: 20px;
                  padding: 15px;
                  display: inline-block;
                  background-color: white;
                  border-radius: 50%;
                  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                }
                
                .logo {
                  width: 100px;
                  height: 100px;
                  object-fit: contain;
                }
                
                .header-title {
                  color: white;
                  font-size: 28px;
                  margin: 0;
                  padding: 0 20px;
                  font-weight: 300;
                  letter-spacing: 1px;
                  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                }
                
                .header-subtitle {
                  color: rgba(255, 255, 255, 0.9);
                  font-size: 18px;
                  margin: 10px 0 0;
                  font-weight: 300;
                }
                
                /* Crystal accents */
                .crystal-accent {
                  position: absolute;
                  width: 150px;
                  height: 150px;
                  opacity: 0.6;
                  z-index: 1;
                }
                
                .crystal-accent-1 {
                  top: -50px;
                  right: -50px;
                  transform: rotate(45deg);
                }
                
                .crystal-accent-2 {
                  bottom: -70px;
                  left: -70px;
                  transform: rotate(-15deg);
                }
                
                /* Wave separator */
                .wave-separator {
                  height: 50px;
                  background-color: white;
                  position: relative;
                  margin-top: -50px;
                  z-index: 3;
                  border-radius: 100% 100% 0 0;
                }
                
                /* Content styles */
                .content {
                  padding: 40px 40px;
                  background-color: #ffffff;
                  position: relative;
                  z-index: 3;
                }
                
                .crystals-banner {
                  width: 100%;
                  height: auto;
                  border-radius: 10px;
                  margin-bottom: 30px;
                  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                  transition: transform 0.3s ease;
                }
                
                h2 {
                  color: #E63946;
                  font-size: 24px;
                  margin-top: 0;
                  margin-bottom: 20px;
                  font-weight: 600;
                }
                
                p {
                  margin-bottom: 20px;
                  color: #444;
                  font-size: 16px;
                  line-height: 1.7;
                }
                
                /* Button styles */
                .btn-container {
                  text-align: center;
                  margin: 40px 0;
                  position: relative;
                }
                
                .sparkle {
                  position: absolute;
                  width: 20px;
                  height: 20px;
                  opacity: 0.6;
                }
                
                .sparkle-1 {
                  top: 10px;
                  left: 30%;
                }
                
                .sparkle-2 {
                  bottom: 10px;
                  right: 30%;
                }
                
                .reset-btn {
                  display: inline-block;
                  background: linear-gradient(to right, #E63946, #a71d29);
                  color: white;
                  text-decoration: none;
                  padding: 16px 40px;
                  border-radius: 50px;
                  font-weight: bold;
                  letter-spacing: 1px;
                  font-size: 16px;
                  box-shadow: 0 5px 15px rgba(230, 57, 70, 0.4);
                  transition: all 0.3s ease;
                  position: relative;
                  overflow: hidden;
                }
                
                .reset-btn:hover {
                  transform: translateY(-2px);
                  box-shadow: 0 8px 20px rgba(230, 57, 70, 0.5);
                }
                
                .reset-btn::after {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: -100%;
                  width: 100%;
                  height: 100%;
                  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                  transition: 0.5s;
                }
                
                .reset-btn:hover::after {
                  left: 100%;
                }
                
                .expires-text {
                  font-size: 14px;
                  color: #888;
                  text-align: center;
                  margin-top: 15px;
                  font-style: italic;
                }
                
                /* Crystal showcase section */
                .showcase-section {
                  background: linear-gradient(to bottom, #fff, #f8f0f1);
                  padding: 40px;
                  position: relative;
                  overflow: hidden;
                  border-top: 1px solid rgba(230, 57, 70, 0.1);
                }
                
                .section-title {
                  text-align: center;
                  color: #E63946;
                  margin-bottom: 30px;
                  position: relative;
                  display: inline-block;
                  left: 50%;
                  transform: translateX(-50%);
                }
                
                .section-title::after {
                  content: '';
                  display: block;
                  width: 80px;
                  height: 2px;
                  background: linear-gradient(to right, transparent, #E63946, transparent);
                  margin: 10px auto 0;
                }
                
                .crystals-grid {
                  display: flex;
                  flex-wrap: wrap;
                  justify-content: center;
                  margin: 20px 0 30px;
                }
                
                .crystal-item {
                  width: 100px;
                  height: 100px;
                  margin: 10px;
                  border-radius: 15px;
                  overflow: hidden;
                  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                  transition: all 0.3s ease;
                  position: relative;
                }
                
                .crystal-item:hover {
                  transform: translateY(-5px);
                  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
                }
                
                .crystal-img {
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                }
                
                .crystal-name {
                  position: absolute;
                  bottom: 0;
                  left: 0;
                  right: 0;
                  background: rgba(230, 57, 70, 0.8);
                  color: white;
                  padding: 5px;
                  font-size: 12px;
                  text-align: center;
                }
                
                /* Testimonial section */
                .testimonial {
                  background-color: #fff;
                  border-radius: 10px;
                  padding: 20px;
                  margin: 20px 0;
                  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
                  border-left: 3px solid #E63946;
                }
                
                .testimonial-text {
                  font-style: italic;
                  color: #555;
                  margin-bottom: 10px;
                }
                
                .testimonial-author {
                  font-weight: bold;
                  color: #E63946;
                  display: block;
                  text-align: right;
                }
                
                /* Footer styles */
                .footer {
                  background: linear-gradient(135deg, #222, #111);
                  color: white;
                  text-align: center;
                  padding: 40px 20px;
                  position: relative;
                  overflow: hidden;
                }
                
                .footer-pattern {
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  opacity: 0.05;
                  background-image: url('/api/placeholder/600/200');
                  background-size: cover;
                }
                
                .footer-content {
                  position: relative;
                  z-index: 2;
                }
                
                .social-links {
                  margin-bottom: 20px;
                }
                
                .social-icon {
                  display: inline-block;
                  width: 40px;
                  height: 40px;
                  background-color: rgba(255, 255, 255, 0.1);
                  border-radius: 50%;
                  margin: 0 8px;
                  line-height: 40px;
                  text-align: center;
                  font-size: 18px;
                  transition: all 0.3s ease;
                  color: white;
                  text-decoration: none;
                }
                
                .social-icon:hover {
                  background-color: #E63946;
                  transform: translateY(-3px);
                }
                
                .footer-logo {
                  margin-bottom: 20px;
                }
                
                .footer-logo img {
                  height: 40px;
                  filter: brightness(0) invert(1);
                  opacity: 0.8;
                }
                
                .footer-text {
                  color: rgba(255, 255, 255, 0.7);
                  font-size: 13px;
                  margin: 8px 0;
                }
                
                .footer-divider {
                  width: 60px;
                  height: 2px;
                  background: rgba(255, 255, 255, 0.1);
                  margin: 15px auto;
                }
                
                /* Responsive styles */
                @media screen and (max-width: 600px) {
                  .content, .showcase-section {
                    padding: 30px 20px;
                  }
                  
                  .header-overlay {
                    padding: 30px 0 50px;
                  }
                  
                  .logo {
                    width: 80px;
                    height: 80px;
                  }
                  
                  .header-title {
                    font-size: 22px;
                  }
                  
                  .header-subtitle {
                    font-size: 16px;
                  }
                  
                  h2 {
                    font-size: 20px;
                  }
                  
                  p {
                    font-size: 15px;
                  }
                  
                  .reset-btn {
                    padding: 14px 30px;
                    font-size: 15px;
                  }
                  
                  .crystal-item {
                    width: 80px;
                    height: 80px;
                    margin: 5px;
                    border-radius: 10px;
                  }
                  
                  .testimonial {
                    padding: 15px;
                  }
                }
              </style>
            </head>
            <body>
              <div class="email-container">
                <!-- Header with background and overlay -->
                <div class="header">
                  <div class="header-background"></div>
                  <img src="/api/placeholder/150/150" alt="Crystal accent" class="crystal-accent crystal-accent-1">
                  <img src="/api/placeholder/150/150" alt="Crystal accent" class="crystal-accent crystal-accent-2">
                  <div class="header-overlay">
                    <div class="logo-container">
                      <img src="/assets/logo.png" alt="Cosmo Crystals" class="logo">
                    </div>
                    <h1 class="header-title">Password Reset Request</h1>
                    <p class="header-subtitle">Restore your access to cosmic energy</p>
                  </div>
                </div>
                
                <!-- Wave separator -->
                <div class="wave-separator"></div>
                
                <!-- Main content -->
                <div class="content">
                  <img src="/api/placeholder/520/200" alt="Beautiful crystals collection" class="crystals-banner">
                  
                  <h2>Cosmic Greetings,</h2>
                  <p>We received a request to reset the password for your Cosmo Crystals account. Your spiritual journey with us is important, and we're here to help you regain access to your cosmic sanctuary.</p>
                  <p>To create a new password and continue exploring our collection of healing crystals and gemstones, please click the button below:</p>
                  
                  <div class="btn-container">
                    <img src="/api/placeholder/20/20" alt="Sparkle" class="sparkle sparkle-1">
                    <img src="/api/placeholder/20/20" alt="Sparkle" class="sparkle sparkle-2">
                    <a href="${resetLink}" class="reset-btn">Reset My Password</a>
                    <p class="expires-text">For your security, this magical link will expire in 30 minutes</p>
                  </div>
                  
                  <p>If you didn't request this password reset, please ignore this email or contact our support wizards if you have any concerns about your account security.</p>
                </div>
                
                <!-- Crystal showcase section -->
                <div class="showcase-section">
                  <h2 class="section-title">Discover Our Treasures</h2>
                  <p>Each crystal in our collection is carefully selected to enhance your spiritual journey and bring balance to your energy centers.</p>
                  
                  <!-- Crystal showcase -->
                  <div class="crystals-grid">
                    <div class="crystal-item">
                      <img src="/api/placeholder/100/100" alt="Amethyst" class="crystal-img">
                      <div class="crystal-name">Amethyst</div>
                    </div>
                    <div class="crystal-item">
                      <img src="/api/placeholder/100/100" alt="Rose Quartz" class="crystal-img">
                      <div class="crystal-name">Rose Quartz</div>
                    </div>
                    <div class="crystal-item">
                      <img src="/api/placeholder/100/100" alt="Citrine" class="crystal-img">
                      <div class="crystal-name">Citrine</div>
                    </div>
                    <div class="crystal-item">
                      <img src="/api/placeholder/100/100" alt="Clear Quartz" class="crystal-img">
                      <div class="crystal-name">Clear Quartz</div>
                    </div>
                  </div>
                  
                  <!-- Testimonial -->
                  <div class="testimonial">
                    <p class="testimonial-text">"The crystals from Cosmo Crystals have transformed my meditation practice and brought new energy into my home. Their selection is simply divine!"</p>
                    <span class="testimonial-author">— Sarah M., Verified Customer</span>
                  </div>
                </div>
                
                <!-- Footer -->
                <div class="footer">
                  <div class="footer-pattern"></div>
                  <div class="footer-content">
                    <div class="footer-logo">
                      <img src="/api/placeholder/120/40" alt="Cosmo Crystals" />
                    </div>
                    <div class="social-links">
                      <a href="#" class="social-icon">f</a>
                      <a href="#" class="social-icon">i</a>
                      <a href="#" class="social-icon">p</a>
                      <a href="#" class="social-icon">t</a>
                    </div>
                    <div class="footer-divider"></div>
                    <p class="footer-text">© ${new Date().getFullYear()} Cosmo Crystals. All rights reserved.</p>
                    <p class="footer-text">123 Spiritual Way, Crystal City, Universe 12345</p>
                    <p class="footer-text">Bringing cosmic energy to earthly beings since 2010</p>
                  </div>
                </div>
              </div>
            </body>
            </html>`,
  });

  if (error) {
    console.error("Resend error sending reset email:", error);
    throw error;
  }
};

export const sendOrderEmail = async (
  email: string,
  orderDetails: {
    items: any[];
    total: number;
    name: string;
    shippingAddress: any;
    orderId?: string;
  },
) => {
  const { items, total, name, shippingAddress } = orderDetails;

  const itemsHtml = items
    .map(
      (item: any) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <div style="font-weight: bold;">${item.name || "Product"}</div>
        <div style="font-size: 12px; color: #888;">Qty: ${item.quantity}</div>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
        $${(item.price || 0).toFixed(2)}
      </td>
    </tr>
  `,
    )
    .join("");

  const addressHtml = `
    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
      <h3 style="margin-top: 0; color: #555;">Shipping Address</h3>
      <p style="margin: 0; color: #666;">
        ${shippingAddress.street || ""}<br>
        ${shippingAddress.city || ""}, ${shippingAddress.state || ""} ${
          shippingAddress.postalCode || ""
        }<br>
        ${shippingAddress.country || ""}
      </p>
    </div>
  `;

  const { data, error } = await resend.emails.send({
    from: "Cosmo Crystals <noreply@cosmocrystals.com>",
    to: email,
    cc: "cosmocrystalsshop@gmail.com",
    subject: "Order Confirmation - Cosmo Crystals",
    html: `<!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Order Confirmation - Cosmo Crystals</title>
              <style>
                body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f7f7f7; }
                .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15); }
                .header { background: linear-gradient(135deg, #E63946, #a71d29); padding: 30px; text-align: center; color: white; }
                .content { padding: 40px; }
                .order-summary { margin-top: 30px; border: 1px solid #eee; border-radius: 8px; overflow: hidden; }
                .order-total { background-color: #f0f0f0; padding: 15px; text-align: right; font-weight: bold; font-size: 18px; }
              </style>
            </head>
            <body>
              <div class="email-container">
                <div class="header">
                  <h1 style="margin: 0;">Order Confirmed!</h1>
                  <p style="margin: 10px 0 0; opacity: 0.9;">Thank you for your purchase, ${name}</p>
                </div>
                
                <div class="content">
                  <p>Your order has been received and is being processed. We'll send you another email when it ships.</p>
                  
                  ${addressHtml}
                  
                  <div class="order-summary">
                    <table style="width: 100%; border-collapse: collapse;">
                      ${itemsHtml}
                    </table>
                    <div class="order-total">
                      Total: $${total.toFixed(2)}
                    </div>
                  </div>
                  
                  <div style="text-align: center; margin-top: 40px; color: #888; font-size: 12px;">
                    <p>© ${new Date().getFullYear()} Cosmo Crystals. All rights reserved.</p>
                  </div>
                </div>
              </div>
            </body>
            </html>`,
  });

  if (error) {
    console.error("Resend error sending order email:", error);
    throw error;
  }
};
