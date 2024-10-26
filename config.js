import themes from "daisyui/src/theming/themes";

const config = {
  // REQUIRED
  appName: "MenúAhora",
  // REQUIRED: a short description of your app for SEO tags (can be overwritten)
  appDescription:
    "The NextJS boilerplate with all you need to build your SaaS, AI tool, or any other web app.",
  // REQUIRED (no https://, not trialing slash at the end, just the naked domain)
  domainName: "menuahora.com",
  crisp: {
    // Crisp website ID. IF YOU DON'T USE CRISP: just remove this => Then add a support email in this config file (mailgun.supportEmail) otherwise customer support won't work.
    id: "",
    // Hide Crisp by default, except on route "/". Crisp is toggled with <ButtonSupport/>. If you want to show Crisp on every routes, just remove this below
    onlyShowOnRoutes: ["/"],
  },
  stripe: {
    // Create multiple plans in your Stripe dashboard, then add them here. You can add as many plans as you want, just make sure to add the priceId
    plans: [
      {
        // REQUIRED — we use this to find the plan in the webhook (for instance if you want to update the user's credits based on the plan)
        priceId: {
          monthly: process.env.NODE_ENV === 'production' ? "price_1QDzlkJJJ3WlVwt961PJVKdL" : "price_1QDzlkJJJ3WlVwt961PJVKdL",
          yearly: process.env.NODE_ENV === 'production' ? "price_1QDzp8JJJ3WlVwt9tp8lHMx7" : "price_1QDzp8JJJ3WlVwt9tp8lHMx7"  // Update this to the correct yearly price ID
        },
        //  REQUIRED - Name of the plan, displayed on the pricing page
        name: "Plan Esencial",
        // A friendly description of the plan, displayed on the pricing page. Tip: explain why this plan and not others
        description: "Perfecto para comenzar con una presencia en línea",
        // The price you want to display, the one user will be charged on Stripe.
        price: {
          monthly: 199,
          yearly: 1499
        },
        // If you have an anchor price (i.e. $29) that you want to display crossed out, put it here. Otherwise, leave it empty
        priceAnchor: {
          // monthly: 39,
          // yearly: 399
        },
        features: [
          { name: "Plantilla con Personalización Básica" },
          { name: "Link personalizado" },
          { name: "Productos ilimitados" },
          { name: "Categorías ilimitadas" },
          { name: "Sistema fácil para subir productos" },
          { name: "Disponible inmediatamente" },
        ],


      
        // Add this line to specify the payment mode
        mode: "subscription",
      },
      {
        // This plan will look different on the pricing page, it will be highlighted. You can only have one plan with isFeatured: true
        isFeatured: true,
        priceId: {
          monthly: "price_monthly_custom",
          yearly: "price_yearly_custom"
        },  
        name: "Plan Custom",
        description: "Solución completa adaptada a tu marca",
        price: {
          monthly: 499,
          yearly: 3999
        },
        priceAnchor: {
          monthly: 79,
          yearly: 799
        },
        features: [
          { name: "Productos ilimitados" },
          { name: "Categorías ilimitadas" },
          { name: "Sistema fácil para subir productos" },
          { name: "Link personalizado" },
          { name: "Diseño completamente personalizado adaptado a tu marca" },
          { name: "Dominio propio" },
          { name: "Sistema de pedidos por WhatsApp" },
        ],
        // Add this line to specify the payment mode
        mode: "subscription",
      },
      {
        priceId: {
          yearly: "price_yearly_enterprise"
        },
        name: "Plan a medida",
        description: "Solución completa adaptada a tu marca",
        price: {
          yearly: 6999
        },
        features: [
          { name: "Productos ilimitados" },
          { name: "Categorías ilimitadas" },
          { name: "Sistema fácil para subir productos" },
          { name: "Link personalizado" },
          { name: "Diseño completamente personalizado adaptado a tu marca" },
          { name: "Dominio propio" },
          { name: "Sistema de pedidos por WhatsApp" },
        ],
        // Add this line to specify the payment mode
        mode: "payment",
      },
    ],
  },
  aws: {
    // If you use AWS S3/Cloudfront, put values in here
    bucket: "bucket-name",
    bucketUrl: `https://bucket-name.s3.amazonaws.com/`,
    cdn: "https://cdn-id.cloudfront.net/",
  },
  mailgun: {
    // subdomain to use when sending emails, if you don't have a subdomain, just remove it. Highly recommended to have one (i.e. mg.yourdomain.com or mail.yourdomain.com)
    subdomain: "",
    // REQUIRED — Email 'From' field to be used when sending magic login links
    fromNoReply: `MenúAhora <noreply@menuahora.com>`,
    // REQUIRED — Email 'From' field to be used when sending other emails, like abandoned carts, updates etc..
    fromAdmin: `Uriel at MenúAhora <uriel@menuahora.com>`,
    // Email shown to customer if need support. Leave empty if not needed => if empty, set up Crisp above, otherwise you won't be able to offer customer support."
    supportEmail: "uriel@menuahora.com",
    // When someone replies to supportEmail sent by the app, forward it to the email below (otherwise it's lost). If you set supportEmail to empty, this will be ignored.
    forwardRepliesTo: "uriel@menuahora.com",
  },
  colors: {
    // REQUIRED — The DaisyUI theme to use (added to the main layout.js). Leave blank for default (light & dark mode). If you any other theme than light/dark, you need to add it in config.tailwind.js in daisyui.themes.
    theme: "light",
    // REQUIRED — This color will be reflected on the whole app outside of the document (loading bar, Chrome tabs, etc..). By default it takes the primary color from your DaisyUI theme (make sure to update your the theme name after "data-theme=")
    // OR you can just do this to use a custom color: main: "#f37055". HEX only.
    main: "#ffffff",
  },
  auth: {
    loginUrl: "/auth/signin",
    callbackUrl: "/dashboard",
  },
};

export default config;
