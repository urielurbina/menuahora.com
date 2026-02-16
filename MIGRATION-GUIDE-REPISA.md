# Migration Guide: MenuAhora → Repisa

Complete guide to rebrand from **menuahora.com** to **repisa.co**

---

## Pre-Migration Checklist

- [ ] Purchase domain `repisa.co`
- [ ] Create new email accounts for repisa.co
- [ ] Backup current database
- [ ] Note down all current Stripe webhook URLs

---

## Phase 1: External Services

### 1.1 Domain & DNS (Do First)

1. **Purchase repisa.co** (Google Domains, Namecheap, Cloudflare, etc.)
2. **Configure DNS** pointing to your hosting (Vercel):
   - Add CNAME record: `www` → `cname.vercel-dns.com`
   - Add A record: `@` → Vercel IP (or use Vercel's automatic DNS)
3. **In Vercel Dashboard**:
   - Go to Project Settings → Domains
   - Add `repisa.co` and `www.repisa.co`
   - Keep `menuahora.com` temporarily for redirects

### 1.2 Email Setup

Create these email addresses for repisa.co:
- `noreply@repisa.co` - Transactional emails
- `uriel@repisa.co` - Admin/support contact
- `soporte@repisa.co` (optional) - Support alias

**Options:**
- Google Workspace
- Zoho Mail (free for 1 user)
- Resend.com (for transactional only)

### 1.3 Stripe Configuration

**In Stripe Dashboard (https://dashboard.stripe.com):**

#### 1.3.1 Update Webhook Endpoints (OBLIGATORIO)

1. Ir a **Developers → Webhooks → Add endpoint**
2. Endpoint URL: `https://repisa.co/api/webhook/stripe`
3. Seleccionar **"Your account"**
4. API version: **"2024-09-30.acacia"** (Your current version)
5. Seleccionar estos 6 eventos:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
6. Click "Add endpoint"
7. **IMPORTANTE:** Copiar el nuevo "Signing secret" (empieza con `whsec_...`)
8. Mantener el webhook viejo activo durante la transición

#### 1.3.2 Update Business Details (OBLIGATORIO)

1. Ir a **Settings → Business settings → Public details**
2. Cambiar nombre a "Repisa"
3. Cambiar support email a `uriel@repisa.co`

#### 1.3.3 Branding (OPCIONAL)

Solo si quieres actualizar logo/colores:
- **Checkout:** Settings → Checkout and Payment Links → Branding
- **Customer Portal:** Settings → Billing → Customer portal

#### ❌ NO necesitas hacer:

- **Payment Links:** No los usas - tu checkout usa `window.location.origin` que se adapta automáticamente al nuevo dominio
- **Success/Cancel URLs:** Son dinámicas en el código, no están hardcodeadas

### 1.4 MongoDB Atlas

**In MongoDB Atlas Dashboard:**

1. **Database rename is NOT required** - just a cosmetic cluster name
2. **Optional:** Create new cluster named "repisa" and migrate data
3. **Update IP Whitelist** if server IPs change

### 1.5 Social Media

1. **Instagram:**
   - Change username: @menuahora → @repisa.co (or @rpisaapp)
   - Update bio, profile picture, links

2. **Facebook:**
   - Update page name and username
   - Update links in about section

3. **Update WhatsApp Business:**
   - Update business name in WhatsApp

---

## Phase 2: Environment Variables

### 2.1 Update `.env.local`

```bash
# Before
NEXT_PUBLIC_BASE_URL=https://menuahora.com

# After
NEXT_PUBLIC_BASE_URL=https://repisa.co
```

### 2.2 Update Vercel Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

| Variable | Old Value | New Value |
|----------|-----------|-----------|
| `NEXT_PUBLIC_BASE_URL` | `https://menuahora.com` | `https://repisa.co` |
| `STRIPE_WEBHOOK_SECRET` | (old secret) | (new webhook secret) |

---

## Phase 3: Code Changes

### 3.1 Configuration File

**File: `config.js`**

```javascript
// Lines to change:
appName: "Repisa",                    // was "MenúAhora"
domainName: "repisa.co",             // was "menuahora.com"
fromNoReply: 'Repisa <noreply@repisa.co>',
fromAdmin: 'Uriel at Repisa <uriel@repisa.co>',
supportEmail: "uriel@repisa.co",
forwardRepliesTo: "uriel@repisa.co",
```

### 3.2 Layout Files

**File: `app/[username]/layout.js`**
- Line 9: Change fallback URL to `https://repisa.co`
- Line 43: Change siteName fallback to `Repisa`
- Line 89: Change siteName to `Repisa`

**File: `app/[username]/opengraph-image.js`**
- Line 11: Change fallback URL to `https://repisa.co`
- Line 72: Change fallback name to `Repisa`
- Line 111: Change text to `Repisa`

### 3.3 Page Files

**File: `app/[username]/page.js`**
- Line 1060: Change href to `https://repisa.co`

**File: `app/demo/page.js`**
- Line 260: Change href to `https://repisa.co`

**File: `app/haussmann/page.js`**
- Line 201-202: Change href and text to `repisa.co`

**File: `app/admin/page.js`**
- Line 6: Change PAYMENT_LINK to `https://repisa.co/trial-expirado`

**File: `app/admin/comercios/page.js`**
- Line 15: Change PAYMENT_LINK to `https://repisa.co/trial-expirado`

**File: `app/admin/comercio/[id]/page.js`**
- Line 178: Change display text to `repisa.co/{business.username}`

**File: `app/trial-expirado/page.js`**
- Line 222: Change mailto to `uriel@repisa.co`

### 3.4 Dashboard Files

**File: `app/dashboard/page.js`**
- Line 30: Change menuLink to `https://repisa.co/${username}`
- Line 44: Change download filename to `repisa-${username}-qr.png`
- Line 80: Change input value to `https://repisa.co/${username}`
- Line 125: Change QR text to `https://repisa.co/${username}`

**File: `app/dashboard/referidos/page.js`**
- Line 476: Change display to `repisa.co/{referral.username}`

**File: `app/dashboard/suscripcion/page.js`**
- Line 413-414: Change email to `uriel@repisa.co`

### 3.5 Onboarding

**File: `app/onboarding/page.js`**
- Line 455: Change display to `repisa.co/`

### 3.6 API Endpoints

**File: `app/api/referrals/route.js`**
- Line 102: Change referralLink to `https://repisa.co/?ref=${referralCode}`

**File: `app/api/og/[username]/route.js`**
- Line 45: Change fallback logo URL to `https://repisa.co/default-logo.png`

### 3.7 Legal Pages

**File: `app/privacy-policy/page.js`**
- Line 62: Update text to reference "Repisa" and `https://repisa.co`

**File: `app/tos/page.js`**
- Line 62: Update text to reference "Repisa" and `https://repisa.co`

### 3.8 Components

**File: `components/HeroSection.js`**
- Line 137: Change href to `https://repisa.co/tacosuriel`
- Line 153-154: Rename images from `screenshot-menuahora-*` to `screenshot-repisa-*`

**File: `components/BigCTA.js`**
- Line 46: Change href to `https://repisa.co/tacosuriel`

**File: `components/InitialSetup.js`**
- Line 59: Change display to `repisa.co/`

**File: `components/HowItWorks.js`**
- Line 55: Change href to `https://repisa.co/crear-menu-digital`

**File: `components/Footer.js`**
- Line 20: Update WhatsApp message to mention "Repisa"
- Line 25: Change Instagram link to new handle
- Line 30: Change Facebook link to new page

**File: `components/SocialProof.js`**
- Line 13: Update testimonial text
- Lines 17, 24, 31: Change website URLs to `https://repisa.co`

### 3.9 Hooks & Utilities

**File: `hooks/useReferralCode.js`**
- Line 6: Change key to `repisa_referral`

**File: `components/ReferralCapture.js`**
- Line 6: Change key to `repisa_referral`

### 3.10 Static Files

**File: `public/robots.txt`**
```txt
User-agent: *
Allow: /

Sitemap: https://repisa.co/sitemap.xml
```

**File: `public/sitemap.xml`** and **`public/sitemap-0.xml`**
- Update all URLs from menuahora.com to repisa.co

## Phase 4: Database Updates (Optional)

If you want to update stored URLs in the database:

```javascript
// Run in MongoDB shell or script
// Update any stored menuahora.com URLs in business documents
db.businesses.updateMany(
  {},
  [{
    $set: {
      // Update any fields that store full URLs
    }
  }]
);
```

---

## Phase 5: Deployment

### 5.1 Deploy to Staging First (Recommended)

1. Create a preview branch
2. Push changes
3. Test all features with new domain

### 5.2 Production Deployment

```bash
git add .
git commit -m "Rebrand: MenuAhora → Repisa (repisa.co)"
git push origin main
```

### 5.3 Configure Redirects

Add to `next.config.js` or `vercel.json`:

```javascript
// next.config.js - add redirects
async redirects() {
  return [
    // Redirect old domain to new
    {
      source: '/:path*',
      has: [{ type: 'host', value: 'menuahora.com' }],
      destination: 'https://repisa.co/:path*',
      permanent: true,
    },
    {
      source: '/:path*',
      has: [{ type: 'host', value: 'www.menuahora.com' }],
      destination: 'https://repisa.co/:path*',
      permanent: true,
    },
  ];
},
```

---

## Phase 6: Post-Migration

### 6.1 Testing Checklist

- [ ] Homepage loads correctly
- [ ] User signup/login works
- [ ] Stripe checkout completes
- [ ] Webhook payments process
- [ ] Email delivery works
- [ ] QR codes generate with new URLs
- [ ] Referral links work
- [ ] All menu pages load (`repisa.co/username`)
- [ ] Admin dashboard works
- [ ] Social share images generate

### 6.2 SEO Considerations

1. **Submit new sitemap** to Google Search Console
2. **Add repisa.co** as a new property in Search Console
3. **Request indexing** for key pages
4. **Monitor 301 redirects** are working from old domain

### 6.3 Communication

- [ ] Email existing users about the rebrand
- [ ] Update social media profiles
- [ ] Update any external links (directories, partners)
- [ ] Update App Store listing if applicable

### 6.4 Keep Old Domain Active

Keep `menuahora.com` registered and redirecting for at least:
- **1 year minimum** for SEO link equity transfer
- **Indefinitely** if budget allows (prevents squatters)

---

## Quick Reference: All Files to Edit

```
config.js
.env.local
app/[username]/layout.js
app/[username]/opengraph-image.js
app/[username]/page.js
app/demo/page.js
app/haussmann/page.js
app/admin/page.js
app/admin/comercios/page.js
app/admin/comercio/[id]/page.js
app/trial-expirado/page.js
app/dashboard/page.js
app/dashboard/referidos/page.js
app/dashboard/suscripcion/page.js
app/onboarding/page.js
app/api/referrals/route.js
app/api/og/[username]/route.js
app/privacy-policy/page.js
app/tos/page.js
components/HeroSection.js
components/BigCTA.js
components/InitialSetup.js
components/HowItWorks.js
components/Footer.js
components/SocialProof.js
hooks/useReferralCode.js
components/ReferralCapture.js
public/robots.txt
public/sitemap.xml
public/sitemap-0.xml
next.config.js (add redirects)
```

---

## Timeline Suggestion

1. **Day 1:** Purchase domain, set up DNS, create emails
2. **Day 2:** Update Stripe, make all code changes
3. **Day 3:** Test in staging/preview deployment
4. **Day 4:** Deploy to production, configure redirects
5. **Day 5:** Monitor, fix any issues, communicate to users

---

Good luck with the rebrand! 🚀
