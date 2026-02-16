import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

// USER SCHEMA
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      private: true,
    },
    image: {
      type: String,
    },
    // Used in the Stripe webhook to identify the user in Stripe and later create Customer Portal or prefill user credit card details
    customerId: {
      type: String,
      validate(value) {
        return value.includes("cus_");
      },
    },
    // Used in the Stripe webhook. should match a plan in config.js file.
    priceId: {
      type: String,
      validate(value) {
        return value.includes("price_");
      },
    },
    // Used to determine if the user has access to the product—it's turn on/off by the Stripe webhook
    hasAccess: {
      type: Boolean,
      default: false,
    },
    // Trial fields
    trialStartDate: {
      type: Date,
      default: null,
    },
    trialEndDate: {
      type: Date,
      default: null,
    },
    isOnTrial: {
      type: Boolean,
      default: false,
    },
    // Onboarding fields
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
    personalWhatsapp: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    // Referral fields
    referredBy: {
      type: String, // username del referidor
      trim: true,
      default: null,
    },
    stripeConnectId: {
      type: String, // ID de Stripe Connect para recibir pagos
      default: null,
    },
    stripeConnectOnboarded: {
      type: Boolean,
      default: false,
    },
    referralEarnings: {
      type: Number, // Total ganado históricamente
      default: 0,
    },
    referralPaidOut: {
      type: Number, // Total ya pagado
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);

export default mongoose.models.User || mongoose.model("User", userSchema);
