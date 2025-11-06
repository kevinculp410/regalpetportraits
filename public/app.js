// Simple SPA pages with sample copy and graphics using local assets
const CACHE_BUST = Date.now();


// Local files for the homepage hero four-block (use exact filenames requested)
const HERO_BLOCK = {
  // Use large, non-placeholder local assets to avoid blank tiles
  topLeft: "/images/hero1.png",
  topRight: "/images/hero2.png",
  bottomLeft: "/images/hero3.png",
  bottomRight: "/images/hero4.png",
};

function HomePage() {
  return `
    <section class="hero container">
      <div class="hero-copy">
        <span class="pill"><img src="/assets/crown.svg" style="width:16px;height:16px;vertical-align:-3px;"> Regal Pet Portraits</span>
        <h1>Turn your pet into a Regal Masterpiece</h1>
        <p>
          At Regal Pet Portrait, we redefine instant gratification with our revolutionary service dedicated to your noble companion. Simply provide us with a photo of your cherished pet, and in less time than it takes to enjoy a cup of coffee, you will be viewing a stunning, custom-crafted digital portrait fit for royalty. Our cutting-edge, AI-backed system meticulously analyzes your photo to transform it into a work of art, all less than 10 minutes. We eliminate the anxious wait for physical deliveries and the uncertainty of timelines; in a mere ten minutes, your high-resolution masterpiece is delivered directly to you, ready to be shared with the world, printed on your favorite products, or displayed proudly in your home. This unparalleled speed ensures the excitement of seeing your pet crowned in regal splendor is an immediate and unforgettable experience, making every moment with your future heirloom truly magical.
        </p>
        <div class="hero-actions">
          <a href="/styles" class="btn primary" data-route>Browse Styles</a>
        </div>
      </div>
      <div class="hero-art">
        <img src="/images/hero1.png" alt="Dog in purple portrait" />
        <img src="${HERO_BLOCK.topRight}?v=${CACHE_BUST}" alt="German shepherd portrait" />
        <img src="${HERO_BLOCK.bottomLeft}?v=${CACHE_BUST}" alt="Regal cat in yellow" />
        <img src="${HERO_BLOCK.bottomRight}?v=${CACHE_BUST}" alt="Cat with green background" />
      </div>
    </section>



    <section class="container">
      <h2 class="kicker">How It Works</h2>
      <div class="how-it-works-image" style="text-align:center;">
        <img src="/images/petportriats_how_it_works.png" alt="How It Works" style="max-width:100%;border-radius:8px;border:1px solid #e5e7eb;" />
      </div>
    </section>

    <section class="container">
      <div class="how-it-works-image" style="text-align:center; margin-top:12px;">
        <img src="/images/downloadportrait.png" alt="Download Portrait" style="max-width:100%;border-radius:8px;border:1px solid #e5e7eb;" />
      </div>
    </section>


    <section class="container">
      <h2 class="kicker">Regal Pet Portrait FAQs</h2>
      <p class="muted">We’ve gathered the most commonly asked questions to help you navigate your experience with Regal Pet Portraits. Learn about ordering, styles, and making sure your portrait is perfect.</p>
      <div class="grid">
        <details class="card">
          <summary class="title" style="padding:12px;">What is a Regal Pet Portrait?</summary>
          <div class="body">A custom artwork of your pet in regal attire inspired by classic portrait styles.</div>
        </details>
        <details class="card">
          <summary class="title" style="padding:12px;">How do I order?</summary>
          <div class="body">Choose a style, upload a clear photo, and complete checkout. You’ll receive your print ready digital download within 10 Minutes.</div>
        </details>
        <details class="card">
          <summary class="title" style="padding:12px;">Which pets are supported?</summary>
          <div class="body">Dogs, cats, and most household pets. If you’re unsure, contact us and we’ll confirm.</div>
        </details>
        <details class="card">
          <summary class="title" style="padding:12px;">Can I order a physical print?</summary>
          <div class="body">We do not sell physical prints, but we have partners where you can get traditional physical prints as well as canvas prints.</div>
        </details>
        <details class="card">
          <summary class="title" style="padding:12px;">How long does it take to get my order?</summary>
          <div class="body">Your digital file download is delivered within 5-10 minutes.</div>
        </details>
        <details class="card">
          <summary class="title" style="padding:12px;">What does it cost?</summary>
          <div class="body">
            <p>Our standard resolution digital file download that can produce prints up to 8x10 is only <strong>$9.99</strong>. Our 4× upscaled digital file download capable of large, print-ready output is <strong>$14.98</strong>.</p>
            <div class="card" style="margin-top:8px;">
              <div class="title">Standard Portrait — $9.99</div>
              <div class="muted">High-quality digital portrait of your pet in your chosen style</div>
              <ul>
                <li>1024×1024 resolution</li>
                <li>Digital download</li>
                <li>Perfect for social media</li>
                <li>Ready in 24–48 hours</li>
              </ul>
            </div>
            <div class="card" style="margin-top:8px;">
              <div class="title">Premium Portrait + Upscale — $14.98</div>
              <div class="muted">Everything in Standard plus high-resolution upscaling for printing</div>
              <ul>
                <li>1024×1024 base resolution</li>
                <li>4× upscaled to 4096×4096</li>
                <li>Perfect for large prints</li>
                <li>Print-ready quality</li>
                <li>Ready in 24–48 hours</li>
              </ul>
            </div>
          </div>
        </details>
      </div>
    </section>

    <footer style="background-color:#8b5cf6;color:#fff;padding:16px 0;margin-top:16px;">
      <div class="container" style="display:flex;justify-content:space-between;align-items:center;gap:12px;font-size:12px;">
        <div>CopyRight 2025 @<a href="https://www.BlueSkyAiAutomation.com" style="color:#fff;text-decoration:underline;">BlueSkyAiAutomation</a></div>
        <div style="display:flex;gap:12px;">
          <a href="https://blueskyaiautomation.com/privacy-policy" target="_blank" rel="noopener" style="color:#fff;text-decoration:underline;">Privacy Policy</a>
          <a href="https://blueskyaiautomation.com/terms-of-service" target="_blank" rel="noopener" style="color:#fff;text-decoration:underline;">Terms of Service</a>
        </div>
      </div>
    </footer>
  `;
}

function StylesGrid(showActions=false) {
  const styles = [
    { id: "regency", name: "Royal Regency", img: IMAGES.dog2, desc: "Classic royal attire with ornate trim." },
    { id: "napoleon", name: "Napoleonic General", img: IMAGES.knight, desc: "Bold military regalia and epaulettes." },
    { id: "victoria", name: "Queen Victoria", img: IMAGES.cat2, desc: "Elegant dress with pearls and lace." },
    { id: "knight", name: "Gallant Knight", img: IMAGES.knight, desc: "Armor and plume for heroic pets." },
    { id: "admiral", name: "Grand Admiral", img: IMAGES.admiral, desc: "Naval coat with medals and sash." },
    { id: "jester", name: "Court Jester", img: IMAGES.dog1, desc: "Playful costume with bells." },
  ];
  return `
    <div class="grid cols-3">
      ${styles.map(s => `
      <div class="card">
        <img src="${s.img}" alt="${s.name}" />
        <div class="body">
          <div class="title">${s.name}</div>
          <div class="muted">${s.desc}</div>
          ${showActions ? '' : ''}
        </div>
      </div>`).join('')}
    </div>
  `;
}

function StylesPage() {
  return `
    <section class="container">
      <h1>Choose Your Royal Style</h1>
      <p>Pick a costume that matches your pet's personality. We'll tailor the artwork to your photo.</p>
      <div id="gridStyles" class="grid cols-3">
        <div class="loading">Loading styles...</div>
      </div>
    </section>
  `;
}

function UploadPage() {
  // Get style from URL parameters or sessionStorage
  const urlParams = new URLSearchParams(window.location.search);
  const styleId = urlParams.get('style_id') || sessionStorage.getItem('styleId');
  const styleTitle = urlParams.get('style_title') || sessionStorage.getItem('styleTitle') || 'regency';
  let stylePreviewUrl = `${window.API_BASE_URL}/api/styles/${styleId}/preview`;
  
  // Store in sessionStorage for later use
  if (styleId) sessionStorage.setItem('styleId', styleId);
  if (styleTitle) sessionStorage.setItem('styleTitle', styleTitle);
  if (styleId) sessionStorage.setItem('stylePreviewUrl', stylePreviewUrl);

  // Try to resolve direct preview URL from styles API for better reliability
  (async () => {
    try {
      if (styleId) {
        const stylesRes = await fetch('/api/styles');
        const stylesData = await stylesRes.json();
        const match = (stylesData.data || []).find(s => String(s.id) === String(styleId));
        if (match && match.id) {
          stylePreviewUrl = `/api/styles/${match.id}/preview`;
          sessionStorage.setItem('stylePreviewUrl', stylePreviewUrl);
          const el = document.querySelector('.style-preview img');
          if (el) el.src = stylePreviewUrl;
        }
      }
    } catch (_) {}
  })();
  
  return `
    <section class="container">
      <h1>Upload Your Pet's Photo</h1>
      <div class="style-preview">
        <img src="${stylePreviewUrl}" alt="Selected style preview" />
        <div class="pill">Selected style: ${styleTitle}</div>
      </div>
      <p>Use a well-lit photo with your pet facing forward. Avoid blurry or dark images.</p>

      <div class="upload-zone">
        <input id="fileInput" type="file" accept=".jpg,.jpeg,.png,image/jpeg,image/png" />
        <p class="muted">Drag & drop or choose a file</p>
        <p class="muted" style="margin-top:6px;">Only JPG, JPEG, or PNG files under 5MB are accepted.</p>
      </div>

      <div id="uploadStatus" class="pill" style="display:none; margin-top:10px;"></div>

      <div id="preview" class="preview" style="display:none; margin-top:16px;">
        <img id="previewImg" alt="Pet preview" />
        <div>
          <div class="muted">Looks great! Continue to checkout.</div>
          <a href="/checkout.html" class="btn primary" id="continueBtn">Continue to Checkout</a>
        </div>
      </div>
    </section>
  `;
}

function CheckoutPage() {
  const styleTitle = sessionStorage.getItem('styleTitle') || 'regency';
  const stylePreviewUrl = sessionStorage.getItem('stylePreviewUrl');
  const previewUrl = sessionStorage.getItem('petPreviewUrl') || IMAGES.dog1;
  const styleImg = stylePreviewUrl || IMAGES.knight;
  return `
    <section class="container">
      <h1>Checkout</h1>
      <div id="checkoutStatus" class="pill" style="display:none; margin-bottom:8px;"></div>

      <div class="comparison-grid" style="margin-bottom:12px;">
        <div class="comparison-card">
          <div class="muted" style="margin-bottom:6px;">Your uploaded pet</div>
          <img src="${previewUrl}" alt="Pet" class="comparison-img" />
        </div>
        <div class="comparison-card">
          <div class="muted" style="margin-bottom:6px;">Selected style</div>
          <img src="${styleImg}" alt="Style preview" class="comparison-img" />
        </div>
      </div>

      <div class="summary">
        <div>
          <div class="pill">Style: ${styleTitle}</div>
          <div class="muted" style="display:flex; gap:12px; margin-top:8px; flex-wrap:wrap; align-items:flex-start;">
            <p style="flex:1; min-width:260px; margin:0;">Your portrait will be ready within the next 8-15 minutes after you pay on the next screen. Our standard rendering can produce prints up to 8x10. You will receive a link in your email once ready.</p>
            <p style="flex:1; min-width:260px; margin:0;">Optional upgrade: you may select our 4X Upscale on the checkout page, which can produce prints up to 30x40. This add-on is completely optional. Price: $4.99.</p>
          </div>
          <div class="price">$9.99</div>
          <div class="hero-actions" style="margin-top:8px;">
            <a href="#" class="btn primary" id="proceedCheckoutBtn">Proceed to Checkout</a>
            <a href="#" id="paymentLinkDebug" class="btn" style="display:none;" target="_blank" rel="noopener">Payment Link</a>
            <span id="jobIdDebug" class="muted" style="display:none; margin-left:8px;"></span>
            <a href="/styles" class="btn" data-route>Change Style</a>
          </div>
        </div>
      </div>
    </section>
  `;
}

function SuccessPage() {
  return `
    <section class="container">
      <h1>Order Confirmed</h1>
      <p>We’re getting started on your regal masterpiece. Expect your proof by tomorrow.</p>
      <div class="hero-actions" style="margin-top:8px;">
        <a href="/dashboard" class="btn primary" data-route>View Dashboard</a>
        <a href="/" class="btn" data-route>Return Home</a>
      </div>
    </section>
  `;
}

function DashboardPage() {
  return `
    <section class="container">
      <div style="display:flex; justify-content:space-between; align-items:center; gap:12px;">
        <h1>Dashboard</h1>
        <a href="/styles" class="btn primary" data-route id="placeOrderBtn">Place Order</a>
      </div>
      <div class="tabs" style="display:flex; gap:8px; margin:12px 0;">
        <button class="tab active" data-tab="jobs">Jobs</button>
        <button class="tab" data-tab="account">Account Information</button>
      </div>
      <div id="dashboardStatus" class="pill" style="display:none; margin:8px 0;"></div>
      <div id="jobsSection">
        <h2 style="margin-top:8px;">Previous Jobs</h2>
        <p class="muted" style="margin-top:4px;">Job records will be deleted after 30 days.</p>
        <div id="orderList" class="order-list">
          <div class="loading" style="text-align:center; padding:40px; color:#6b7280;">
            Loading your portraits...
          </div>
        </div>
      </div>
      <div id="accountSection" style="display:none;">
        <h2 style="margin-top:8px;">Account Information</h2>
        <div id="accountInfo" class="grid" style="max-width:560px;">
          <div><strong>Email:</strong> <span id="accountEmail">—</span></div>
          <div><strong>Signed Up:</strong> <span id="accountSignup">—</span></div>
          <div class="hero-actions" style="margin-top:12px;">
            <button class="btn" id="resetPasswordBtn">Reset Password</button>
          </div>
          <div id="accountStatus" class="pill" style="margin-top:10px; display:none;"></div>
        </div>
      </div>
    </section>
  `;
}

function SignInPage() {
  return `
    <section class="container" style="max-width:720px;">
      <h1>Sign in</h1>
      <p class="muted">Access your dashboard or create an account to get started.</p>
      <div class="tabs" style="display:flex; gap:8px; margin:12px 0;">
        <button class="tab active" data-tab="login">Sign In</button>
        <button class="tab" data-tab="create">Create Account</button>
      </div>
      <form id="loginForm" class="grid" style="max-width:560px;">
        <input id="loginEmail" type="email" placeholder="you@example.com" required style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;" />
        <input id="loginPassword" type="password" placeholder="Password" required style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;" />
        <button class="btn primary" type="submit" id="loginBtn">Sign In</button>
      </form>
      <div style="margin-top:8px;">
        <a href="#" id="forgotPasswordLink">Forgot password?</a>
      </div>
      <form id="forgotForm" class="grid" style="max-width:560px; display:none; margin-top:8px;">
        <input id="forgotEmail" type="email" placeholder="you@example.com" style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;" />
        <button class="btn" type="submit" id="forgotSubmitBtn">Send reset link</button>
      </form>

      <form id="createForm" class="grid" style="max-width:560px; display:none;">
        <input id="createName" type="text" placeholder="Your name" required style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;" />
        <input id="createEmail" type="email" placeholder="you@example.com" required style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;" />
        <input id="createPassword" type="password" placeholder="Password" required style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;" />
        <button class="btn primary" type="submit" id="createBtn">Create Account</button>
      </form>
      <div id="authStatus" class="pill" style="margin-top:10px; display:none;"></div>
    </section>
  `;
}

function FAQsPage() {
  const faqs = [
    { q: "What is a Regal Pet Portrait?", a: "A custom artwork of your pet in regal attire inspired by classic portrait styles." },
    { q: "How do I order?", a: "Choose a style, upload a clear photo, and complete checkout. You’ll receive your print ready digital download within 10 Minutes." },
    { q: "Which pets are supported?", a: "Dogs, cats, and most household pets. If you’re unsure, contact us and we’ll confirm." },
    { q: "Can I order a physical print?", a: "We do not sell physical prints, but we have partners where you can get traditional physical prints as well as canvas prints." },
    { q: "How long does it take to get my order?", a: "Your digital file download is delivered within 5-10 minutes." },
    { q: "What does it cost?", a: `
      <p>Our standard resolution digital file download that can produce prints up to 8x10 is only <strong>$9.99</strong>. Our 4× upscaled digital file download capable of large, print-ready output is <strong>$14.98</strong>.</p>
      <div class="card" style="margin-top:8px;">
        <div class="title">Standard Portrait — $9.99</div>
        <div class="muted">High-quality digital portrait of your pet in your chosen style</div>
        <ul>
          <li>1024×1024 resolution</li>
          <li>Digital download</li>
          <li>Perfect for social media</li>
          <li>Ready in 24–48 hours</li>
        </ul>
      </div>
      <div class="card" style="margin-top:8px;">
        <div class="title">Premium Portrait + Upscale — $14.98</div>
        <div class="muted">Everything in Standard plus high-resolution upscaling for printing</div>
        <ul>
          <li>1024×1024 base resolution</li>
          <li>4× upscaled to 4096×4096</li>
          <li>Perfect for large prints</li>
          <li>Print-ready quality</li>
          <li>Ready in 24–48 hours</li>
        </ul>
      </div>
    ` },
  ];
  return `
    <section class="container">
      <h1>Regal Pet Portrait FAQs</h1>
      <div class="grid">
        ${faqs.map(({q,a}) => `
          <details class="card">
            <summary class="title" style="padding:12px;">${q}</summary>
            <div class="body">${a}</div>
          </details>
        `).join('')}
      </div>
    </section>
  `;
}

function PhotoGuidePage() {
  return `
    <section class="container">
      <h1>Photo Guide</h1>
      <p class="muted guide-intro">Great photos lead to great portraits. Use the following guidelines when uploading your pet’s picture.</p>

      <div class="card" style="margin-bottom:12px;">
        <div class="body" style="font-size:1.25rem;">
          <ol class="guide-list">
            <li>Please submit a close-up photo of your pet.</li>
            <li>Make sure the photo is not blurry.</li>
            <li>Make sure the photo has good lighting.</li>
            <li>Include your pet’s full head (no cropped ears, etc.).</li>
            <li>Photos taken at your pet’s eye level produce better results. It is preferred that your pet is looking at the camera.</li>
            <li>Professional photos are not needed. Mobile phone photos work just fine.</li>
          </ol>
        </div>
      </div>
      <div class="card" style="text-align:center;">
        <img src="/images/good_pet_photos.png" alt="Good pet photo examples" style="max-width:100%;height:auto;border-radius:8px;border:1px solid #e5e7eb;" />
      </div>
      <div class="card" style="text-align:center; margin-top:12px;">
        <img src="/images/bad_pet_portrait.png" alt="Bad pet photo examples" style="max-width:100%;height:auto;border-radius:8px;border:1px solid #e5e7eb;" />
      </div>

      
    </section>
  `;
}

function ContactPage() {
  return `
    <section class="container">
      <h1>Contact</h1>
      <p class="muted">Questions, custom requests, or help with your order? We’re here.</p>
      <form id="contactForm" class="grid" style="max-width:680px;">
        <input id="cName" type="text" placeholder="Your name" required style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;" />
        <input id="cEmail" type="email" placeholder="you@example.com" required style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;" />
        <textarea id="cMsg" placeholder="How can we help?" required rows="5" style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;"></textarea>
        <div class="hero-actions">
          <button class="btn primary" type="submit" id="contactSubmitBtn">Send Message</button>
        </div>
      </form>
      <div id="contactStatus" class="pill" style="margin-top:10px; display:none;"></div>
    </section>
  `;
}

function AdminPage() {
  return `
    <section class="container" style="max-width:1000px;">
      <h1>Admin Dashboard</h1>
      <p class="muted">Sign in to manage users, styles, jobs, and archives.</p>

      <form id="adminLoginForm" class="form" style="max-width:420px; margin:16px 0;">
        <input id="adminLoginEmail" type="email" placeholder="Admin email" required style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;" />
        <input id="adminLoginPassword" type="password" placeholder="Password" required style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;" />
        <div class="hero-actions"><button class="btn" type="submit">Login</button></div>
        <div id="adminLoginStatus" class="pill" style="margin-top:10px; display:none;"></div>
      </form>

      <div id="adminShell" style="display:none;">
        <div class="tabs" style="display:flex; gap:8px; border-bottom:1px solid #e5e7eb; margin-bottom:12px;">
          <a href="/admin?tab=users" data-route class="tab" data-tab="users" style="padding:8px 12px; border:1px solid #e5e7eb; border-bottom:none; border-radius:8px 8px 0 0;">Users</a>
          <a href="/admin?tab=styles" data-route class="tab" data-tab="styles" style="padding:8px 12px; border:1px solid #e5e7eb; border-bottom:none; border-radius:8px 8px 0 0;">Styles</a>
          <a href="/admin?tab=sales" data-route class="tab" data-tab="sales" style="padding:8px 12px; border:1px solid #e5e7eb; border-bottom:none; border-radius:8px 8px 0 0;">Sales</a>
          <a href="/admin?tab=archive" data-route class="tab" data-tab="archive" style="padding:8px 12px; border:1px solid #e5e7eb; border-bottom:none; border-radius:8px 8px 0 0;">Archive</a>
          <a href="/admin?tab=account" data-route class="tab" data-tab="account" style="padding:8px 12px; border:1px solid #e5e7eb; border-bottom:none; border-radius:8px 8px 0 0;">Account</a>
        </div>
        <div id="adminTabContent" style="border:1px solid #e5e7eb; border-radius:0 8px 8px 8px; padding:12px;"></div>
      </div>
    </section>
  `;
}

function AdminUsersPage() {
  return `
    <section class="container">
      <h1>Admin - Users</h1>
      <p>Login with admin credentials to manage users and jobs.</p>

      <form id="adminLoginForm" class="form" style="max-width:400px; margin:16px 0;">
        <input id="adminLoginEmail" type="email" placeholder="Admin email" required style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;" />
        <input id="adminLoginPassword" type="password" placeholder="Password" required style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;" />
        <div class="hero-actions"><button class="btn" type="submit">Login</button></div>
        <div id="adminLoginStatus" class="pill" style="margin-top:10px; display:none;"></div>
      </form>

      <div id="adminContent" style="display:none;">
        <div class="subnav" style="margin-bottom:16px; display:flex; gap:8px;">
          <a href="/admin" data-route class="btn">Styles</a>
          <a href="/admin/users" data-route class="btn primary">Users</a>
          <a href="/admin/account" data-route class="btn">Admin Account</a>
          <a href="/admin/archive" data-route class="btn">Archive</a>
        </div>

        <div id="adminUsersStatus" class="pill" style="margin-top:10px; display:none;"></div>
        <div id="adminUsersList" class="grid"></div>
      </div>
    </section>
  `;
}

function AdminArchivePage() {
  return `
    <section class="container">
      <h1>Admin - Archive Jobs</h1>
      <p>Archive all jobs created before a specified date.</p>

      <form id="adminLoginForm" class="form" style="max-width:400px; margin:16px 0;">
        <input id="adminLoginEmail" type="email" placeholder="Admin email" required style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;" />
        <input id="adminLoginPassword" type="password" placeholder="Password" required style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;" />
        <div class="hero-actions"><button class="btn" type="submit">Login</button></div>
        <div id="adminLoginStatus" class="pill" style="margin-top:10px; display:none;"></div>
      </form>

      <div id="adminContent" style="display:none;">
        <div class="subnav" style="margin-bottom:16px; display:flex; gap:8px;">
          <a href="/admin" data-route class="btn">Styles</a>
          <a href="/admin/users" data-route class="btn">Users</a>
          <a href="/admin/jobs" data-route class="btn">Users Jobs</a>
          <a href="/admin/account" data-route class="btn">Admin Account</a>
          <a href="/admin/archive" data-route class="btn primary">Archive</a>
        </div>

        <form id="archiveForm" class="form" style="max-width:480px; margin-top:16px;">
          <label class="muted" for="archiveDate">Archive jobs created before:</label>
          <input id="archiveDate" type="date" required style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;" />
          <div class="hero-actions">
            <button id="archiveSubmitBtn" class="btn primary" type="submit">Archive Jobs</button>
          </div>
          <div id="archiveStatus" class="pill" style="margin-top:10px; display:none;"></div>
        </form>

        <div class="muted" style="margin-top:8px;">
          This will move matching jobs to the archive table and hide them from the Users view.
        </div>

        <hr style="margin:24px 0;" />

        <h2>Archived Jobs</h2>
        <form id="archiveFilterForm" class="form" style="max-width:720px; margin-top:12px; display:grid; grid-template-columns: 1fr 1fr auto auto auto; gap:8px; align-items:end;">
          <div>
            <label class="muted" for="filterStart">Start date</label>
            <input id="filterStart" type="date" style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;" />
          </div>
          <div>
            <label class="muted" for="filterEnd">End date</label>
            <input id="filterEnd" type="date" style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;" />
          </div>
          <div>
            <button id="filterApplyBtn" class="btn" type="submit">Apply</button>
          </div>
          <div>
            <button id="generateListBtn" class="btn" type="button">Generate List</button>
          </div>
          <div>
            <button id="showAllBtn" class="btn" type="button">Show All</button>
          </div>
        </form>
        <div class="hero-actions" style="margin-top:8px;">
          <button id="exportCsvBtn" class="btn" type="button">Export CSV</button>
        </div>
        <div id="archiveListStatus" class="pill" style="margin-top:8px; display:none;"></div>
        <div id="archivedList" class="grid" style="margin-top:12px;"></div>
      </div>
    </section>
  `;
}

function AdminJobsPage() {
  return `
    <section class="container">
      <h1>Admin - Users Jobs</h1>
      <p>View all jobs across users.</p>

      <form id="adminLoginForm" class="form" style="max-width:400px; margin:16px 0;">
        <input id="adminLoginEmail" type="email" placeholder="Admin email" required style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;" />
        <input id="adminLoginPassword" type="password" placeholder="Password" required style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;" />
        <div class="hero-actions"><button class="btn" type="submit">Login</button></div>
        <div id="adminLoginStatus" class="pill" style="margin-top:10px; display:none;"></div>
      </form>

      <div id="adminContent" style="display:none;">
        <div class="subnav" style="margin-bottom:16px; display:flex; gap:8px;">
          <a href="/admin" data-route class="btn">Styles</a>
          <a href="/admin/users" data-route class="btn">Users</a>
          <a href="/admin/account" data-route class="btn">Admin Account</a>
          <a href="/admin/archive" data-route class="btn">Archive</a>
        </div>

        <div id="adminJobsStatus" class="pill" style="margin-top:10px; display:none;"></div>
        <div id="adminJobsList" class="grid"></div>
      </div>
    </section>
  `;
}

function AdminAccountPage() {
  return `
    <section class="container">
      <h1>Admin - Account</h1>
      <p>View admin account information.</p>

      <form id="adminLoginForm" class="form" style="max-width:400px; margin:16px 0;">
        <input id="adminLoginEmail" type="email" placeholder="Admin email" required style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;" />
        <input id="adminLoginPassword" type="password" placeholder="Password" required style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;" />
        <div class="hero-actions"><button class="btn" type="submit">Login</button></div>
        <div id="adminLoginStatus" class="pill" style="margin-top:10px; display:none;"></div>
      </form>

      <div id="adminContent" style="display:none;">
        <div class="subnav" style="margin-bottom:16px; display:flex; gap:8px;">
          <a href="/admin" data-route class="btn">Styles</a>
          <a href="/admin/users" data-route class="btn">Users</a>
          <a href="/admin/account" data-route class="btn primary">Admin Account</a>
          <a href="/admin/archive" data-route class="btn">Archive</a>
        </div>

        <div id="adminAccountStatus" class="pill" style="margin-top:10px; display:none;"></div>
        <div id="adminAccountInfo" class="grid" style="max-width:560px;"></div>
      </div>
    </section>
  `;
}

function VerifyEmailPage() {
  return `
    <section class="container">
      <h1>Email Verification</h1>
      <div id="verifyStatus" class="pill" style="margin-top:20px;">
        Verifying your email address...
      </div>
    </section>
  `;
}

function ResetPasswordPage() {
  return `
    <section class="container" style="max-width:720px;">
      <h1>Reset Password</h1>
      <p class="muted">Enter a new password for your account.</p>
      <form id="resetForm" class="grid" style="max-width:560px;">
        <input id="resetPassword" type="password" placeholder="New password (min 8 chars)" required style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;" />
        <input id="resetPassword2" type="password" placeholder="Confirm new password" required style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;" />
        <button class="btn primary" type="submit" id="resetSubmitBtn">Update Password</button>
      </form>
      <div id="resetStatus" class="pill" style="margin-top:10px; display:none;"></div>
    </section>
  `;
}

function AdminResetPage() {
  return `
    <section class="container" style="max-width:720px;">
      <h1>Admin Password Reset</h1>
      <p class="muted">Enter the admin email to receive a reset link.</p>
      <form id="adminResetForm" class="grid" style="max-width:560px;">
        <input id="adminResetEmail" type="email" placeholder="admin@example.com" required style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;" />
        <button class="btn primary" type="submit" id="adminResetSubmitBtn">Send reset link</button>
      </form>
      <div id="adminResetStatus" class="pill" style="margin-top:10px; display:none;"></div>
      <div class="muted" style="margin-top:8px;">
        This page is not linked in navigation. Bookmark it for future use.
      </div>
    </section>
  `;
}

const routes = {
  "/": HomePage,
  "/signin": SignInPage,
  "/reset-password": ResetPasswordPage,
  "/admin/reset": AdminResetPage,
  "/styles": StylesPage,
  "/upload": UploadPage,
  "/checkout": CheckoutPage,
  "/checkout/success": SuccessPage,
  "/dashboard": DashboardPage,
  "/faqs": FAQsPage,
  "/photo-guide": PhotoGuidePage,
  "/contact": ContactPage,
  "/admin": AdminPage,
  "/admin/styles": AdminPage,
  "/admin/users": AdminPage,
  "/admin/jobs": AdminPage,
  "/admin/account": AdminPage,
  "/admin/archive": AdminPage,
  "/verify-email": VerifyEmailPage,
};

const afterRender = {
  "/admin/reset": () => {
    const form = document.getElementById('adminResetForm');
    const emailInput = document.getElementById('adminResetEmail');
    const status = document.getElementById('adminResetStatus');
    if (emailInput) emailInput.value = 'admin@blueskyaiaa.com';
    if (!form || !status) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.style.display = 'inline-block';
      status.textContent = 'Sending reset email...';
      status.style.backgroundColor = '#eef2ff';
      status.style.color = '#3730a3';
      const email = (emailInput?.value || '').trim();
      try {
        const res = await fetch('/api/auth/admin/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'failed');
        status.textContent = 'Reset email sent. Check inbox for the link.';
        status.style.backgroundColor = '#dcfce7';
        status.style.color = '#16a34a';
        (document.getElementById('adminResetSubmitBtn')).disabled = true;
      } catch (err) {
        status.textContent = 'Unable to send reset email. Please try again later.';
        status.style.backgroundColor = '#fee2e2';
        status.style.color = '#dc2626';
      }
    });
  },
  "/styles": async () => {
    const grid = document.getElementById('gridStyles');
    if (!grid) return;
    
    try {
      const response = await fetch(`${window.API_BASE_URL}/api/styles`);
      const data = await response.json();
      
      if (data.data && data.data.length > 0) {
        // Sort by numeric suffix in original filename/title (ascending): style-m-1, style-m-2, ...
        const items = data.data.slice().sort((a, b) => {
          const af = String(a.original_filename || a.title || '').trim();
          const bf = String(b.original_filename || b.title || '').trim();
          const am = af.match(/(\d+)/);
          const bm = bf.match(/(\d+)/);
          const an = am ? parseInt(am[1], 10) : Number.POSITIVE_INFINITY;
          const bn = bm ? parseInt(bm[1], 10) : Number.POSITIVE_INFINITY;
          if (an !== bn) return an - bn;
          return af.localeCompare(bf, undefined, { numeric: true, sensitivity: 'base' });
        });
        grid.innerHTML = items.map(item => `
          <div class="card">
            <img src="${window.API_BASE_URL}/api/styles/${item.id}/preview" alt="${item.title}" />
            <div class="body">
              <div class="title">${item.title}</div>
              <div class="muted">${item.description || ''}</div>
              <div class="actions">
                <button class="btn primary select-style" data-style-id="${item.id}" data-style-title="${item.title}" data-style-filename="${item.original_filename || ''}">Choose this style</button>
              </div>
            </div>
          </div>
        `).join('');
        
        // Add event listeners for style selection
        document.querySelectorAll('.select-style').forEach(btn => {
          btn.addEventListener('click', async () => {
            const styleId = btn.getAttribute('data-style-id');
            const styleTitle = btn.getAttribute('data-style-title');
            const styleFilename = btn.getAttribute('data-style-filename') || '';
            const previewUrl = `${window.API_BASE_URL}/api/styles/${styleId}/preview`;
            sessionStorage.setItem('styleId', styleId);
            sessionStorage.setItem('styleTitle', styleTitle);
            sessionStorage.setItem('stylePreviewUrl', previewUrl);
            if (styleFilename) sessionStorage.setItem('styleFilename', styleFilename);
            // Check auth before proceeding
            try {
              const meRes = await fetch('/api/auth/me');
              const me = await meRes.json();
              if (!me.logged_in) {
                // Save intended redirect and prompt, then send to signin
                sessionStorage.setItem('postLoginRedirect', `/upload?style_id=${styleId}&style_title=${encodeURIComponent(styleTitle)}`);
                sessionStorage.setItem('authMessage', 'Please sign in to continue with your order.');
                history.pushState({}, '', '/signin');
                render();
                return;
              }
            } catch (e) {
              // If check fails, be safe and require login
              sessionStorage.setItem('postLoginRedirect', `/upload?style_id=${styleId}&style_title=${encodeURIComponent(styleTitle)}`);
              sessionStorage.setItem('authMessage', 'Please sign in to continue with your order.');
              history.pushState({}, '', '/signin');
              render();
              return;
            }
            history.pushState({}, '', `/upload?style_id=${styleId}&style_title=${encodeURIComponent(styleTitle)}`);
            render();
          });
        });
      } else {
        grid.innerHTML = '<div class="muted">No styles available yet.</div>';
      }
    } catch (error) {
      console.error('Failed to load styles:', error);
      grid.innerHTML = '<div class="muted">Failed to load styles. Please try again.</div>';
    }
  },
  "/upload": async () => {
    // Require login for upload
    try {
      const meRes = await fetch('/api/auth/me', { credentials: 'include' });
      const me = await meRes.json();
      if (!me.logged_in) {
        const styleId = sessionStorage.getItem('styleId');
        const styleTitle = sessionStorage.getItem('styleTitle') || 'regency';
        sessionStorage.setItem('postLoginRedirect', `/upload?style_id=${styleId || ''}&style_title=${encodeURIComponent(styleTitle)}`);
        sessionStorage.setItem('authMessage', 'Please sign in to upload your photo.');
        history.pushState({}, '', '/signin');
        render();
        return;
      }
    } catch (e) {
      sessionStorage.setItem('authMessage', 'Please sign in to upload your photo.');
      history.pushState({}, '', '/signin');
      render();
      return;
    }

    const input = document.getElementById('fileInput');
    const preview = document.getElementById('preview');
    const img = document.getElementById('previewImg');
    const status = document.getElementById('uploadStatus');
    if (!input) return;
    input.addEventListener('change', async () => {
      const file = input.files?.[0];
      if (!file) return;

      // Validate file type and size (JPG/JPEG/PNG under 5MB)
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      const maxSizeBytes = 5 * 1024 * 1024; // 5MB
      const ext = (file.name || '').toLowerCase();
      const validExt = ext.endsWith('.jpg') || ext.endsWith('.jpeg') || ext.endsWith('.png');
      const validType = allowedTypes.includes(file.type);
      const typeOk = validType || validExt;
      const sizeOk = file.size <= maxSizeBytes;
      if (!typeOk || !sizeOk) {
        // Build reason-specific message for modal
        const reason = (!typeOk && !sizeOk)
          ? 'The selected file is the wrong format and exceeds the 5MB size limit.'
          : (!typeOk
            ? 'The selected file is the wrong format.'
            : 'The selected file exceeds the 5MB size limit.');

        // Show status pill and modal, prevent upload
        status.style.display = 'inline-block';
        status.style.backgroundColor = '#fee2e2';
        status.style.color = '#dc2626';
        status.textContent = !typeOk && !sizeOk
          ? 'Invalid file type and size. Please select a JPG/JPEG/PNG under 5MB.'
          : (!typeOk ? 'Invalid file type. Please select a JPG/JPEG/PNG file.' : 'File exceeds 5MB. Please select a smaller image.');
        showUploadErrorModal(reason);

        // Immediately clear local state so nothing proceeds
        input.value = '';
        preview.style.display = 'none';
        sessionStorage.removeItem('petPreviewUrl');
        return;
      }

      // Ensure styleId exists
      const styleId = sessionStorage.getItem('styleId');
      const styleTitle = sessionStorage.getItem('styleTitle') || 'regency';
      if (!styleId) {
        alert('Please pick a style first.');
        history.pushState({}, '', '/styles');
        render();
        return;
      }

      // Ensure the user is logged in before proceeding
      try {
        const meRes = await fetch('/api/auth/me', { credentials: 'include' });
        const meCt = meRes.headers.get('content-type') || '';
        const me = meCt.includes('application/json') ? await meRes.json() : { logged_in: false };
        if (!me.logged_in) {
          sessionStorage.setItem('postLoginRedirect', '/upload');
          sessionStorage.setItem('authMessage', 'Please sign in to upload your photo.');
          history.pushState({}, '', '/signin');
          render();
          return;
        }
      } catch (_) {
        // If auth check fails, prompt sign-in
        sessionStorage.setItem('postLoginRedirect', '/upload');
        history.pushState({}, '', '/signin');
        render();
        return;
      }

      // Show local preview immediately
      const url = URL.createObjectURL(file);
      sessionStorage.setItem('petPreviewUrl', url);
      img.src = url;
      preview.style.display = 'grid';

      status.style.display = 'inline-block';
      try {
        // 1) Create job
        status.textContent = 'Creating order...';
        const jobRes = await fetch('/api/jobs/create', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ style_id: styleId })
        });
        const jobCt = jobRes.headers.get('content-type') || '';
        if (!jobCt.includes('application/json')) {
          throw new Error(`server_response_not_json_${jobRes.status}`);
        }
        const jobData = await jobRes.json();
        if (!jobRes.ok || !jobData.job_id) {
          status.style.backgroundColor = '#fee2e2';
          status.style.color = '#dc2626';
          status.textContent = `Order creation failed: ${jobData.error || jobRes.status}`;
          return;
        }
        const jobId = jobData.job_id;
        sessionStorage.setItem('jobId', jobId);

        // Choose upload strategy (default to presigned S3)
        const useDirect = (typeof window.USE_LOCAL_UPLOADS === 'boolean') ? window.USE_LOCAL_UPLOADS : false;
        if (useDirect) {
          // 2) Direct upload to server (bypasses browser CORS)
          status.textContent = 'Uploading photo...';
          const buf = await file.arrayBuffer();
          const directRes = await fetch('/api/uploads/direct', {
            method: 'POST',
            headers: {
              'Content-Type': file.type || 'application/octet-stream',
              'x-job-id': jobId,
              'x-filename': file.name
            },
            credentials: 'include',
            body: buf
          });
          const directCt = directRes.headers.get('content-type') || '';
          if (!directCt.includes('application/json')) {
            throw new Error(`server_response_not_json_${directRes.status}`);
          }
          const direct = await directRes.json();
          if (!directRes.ok || !direct.ok) {
            status.style.backgroundColor = '#fee2e2';
            status.style.color = '#dc2626';
            status.textContent = `Upload failed (server): ${direct.error || directRes.status}`;
            return;
          }
          sessionStorage.setItem('petS3Key', direct.s3_key);
          // Build and store pet_file for checkout
          if (direct.s3_key) {
            const parts = direct.s3_key.split('/');
            const userIdFromKey = parts[1];
            const jobIdFromKey = parts[2];
            const filename = parts.slice(3).join('/');
            if (userIdFromKey && jobIdFromKey && filename) {
              sessionStorage.setItem('petFile', `uploads/${userIdFromKey}/${jobIdFromKey}/${filename}`);
            }
          }
          // Persist photo key to job
          try {
            await fetch(`/api/jobs/${jobId}/photo`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ s3_key: direct.s3_key })
            });
          } catch (_) {}
          status.textContent = 'Upload complete! You can continue to checkout.';
          status.style.backgroundColor = '#dcfce7';
          status.style.color = '#16a34a';
        } else {
          // 2) Presign upload
          status.textContent = 'Preparing upload...';
          const presignRes = await fetch('/api/uploads/presign', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ job_id: jobId, filename: file.name, contentType: file.type || 'application/octet-stream' })
          });
          const presignCt = presignRes.headers.get('content-type') || '';
          if (!presignCt.includes('application/json')) {
            throw new Error(`server_response_not_json_${presignRes.status}`);
          }
          const presign = await presignRes.json();
          if (!presignRes.ok || !presign.url) {
            status.style.backgroundColor = '#fee2e2';
            status.style.color = '#dc2626';
            status.textContent = `Upload prep failed: ${presign.error || presignRes.status}`;
            return;
          }

          // 3) Upload to S3 via presigned URL, with fallback to direct upload
          status.textContent = 'Uploading photo...';
          let uploadedS3Key = presign.s3_key;
          try {
            const putRes = await fetch(presign.url, { method: 'PUT', headers: { 'Content-Type': file.type || 'application/octet-stream' }, body: file });
            if (!putRes.ok) throw new Error('s3_put_failed');
          } catch (_) {
            // Fallback: direct upload to server to bypass CORS
            status.textContent = 'S3 upload blocked; using server upload...';
            const buf = await file.arrayBuffer();
            const directRes = await fetch('/api/uploads/direct', {
              method: 'POST',
              headers: {
                'Content-Type': file.type || 'application/octet-stream',
                'x-job-id': jobId,
                'x-filename': file.name
              },
              credentials: 'include',
              body: buf
            });
            const directCt = directRes.headers.get('content-type') || '';
            if (!directCt.includes('application/json')) {
              throw new Error(`server_response_not_json_${directRes.status}`);
            }
            const direct = await directRes.json();
            if (!directRes.ok || !direct.ok) {
              status.style.backgroundColor = '#fee2e2';
              status.style.color = '#dc2626';
              status.textContent = `Upload failed (server): ${direct.error || directRes.status}`;
              return;
            }
            uploadedS3Key = direct.s3_key;
          }

          // Save S3 key for checkout
          sessionStorage.setItem('petS3Key', uploadedS3Key);
          // Build and store pet_file for checkout
          if (uploadedS3Key) {
            const parts = uploadedS3Key.split('/');
            const userIdFromKey = parts[1];
            const jobIdFromKey = parts[2];
            const filename = parts.slice(3).join('/');
            if (userIdFromKey && jobIdFromKey && filename) {
              sessionStorage.setItem('petFile', `uploads/${userIdFromKey}/${jobIdFromKey}/${filename}`);
            }
          }
          // Persist photo key to job
          try {
            await fetch(`/api/jobs/${jobId}/photo`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ s3_key: uploadedS3Key })
            });
          } catch (_) {}
          status.textContent = 'Upload complete! You can continue to checkout.';
          status.style.backgroundColor = '#dcfce7';
          status.style.color = '#16a34a';
        }
      } catch (err) {
        status.textContent = `Upload failed: ${err.message || 'unknown_error'}`;
        status.style.backgroundColor = '#fee2e2';
        status.style.color = '#dc2626';
      }
    });
  },
  "/contact": () => {
    const form = document.getElementById('contactForm');
    const status = document.getElementById('contactStatus');
    const nameEl = document.getElementById('cName');
    const emailEl = document.getElementById('cEmail');
    const msgEl = document.getElementById('cMsg');
    const submitBtn = document.getElementById('contactSubmitBtn');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.style.display = 'inline-block';
      status.textContent = 'Sending...';
      try {
        const payload = {
          name: nameEl.value,
          email: emailEl.value,
          message: msgEl.value,
        };
        const resp = await fetch('/api/contact/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!resp.ok) throw new Error('send_failed');
        status.textContent = 'Thanks! We’ll reply within one business day.';
        status.style.backgroundColor = '#dcfce7';
        status.style.color = '#16a34a';
        if (nameEl) nameEl.disabled = true;
        if (emailEl) emailEl.disabled = true;
        if (msgEl) msgEl.disabled = true;
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Sent';
        }
      } catch (err) {
        status.textContent = 'Something went wrong. Please email support@regalpetportraits.com';
        status.style.backgroundColor = '#fee2e2';
        status.style.color = '#dc2626';
      }
    });
  },
  "/signin": () => {
    const status = document.getElementById('authStatus');
    const tabs = document.querySelectorAll('.tab');
    const loginForm = document.getElementById('loginForm');
    const createForm = document.getElementById('createForm');
    const forgotLink = document.getElementById('forgotPasswordLink');
    const forgotForm = document.getElementById('forgotForm');
    const forgotEmail = document.getElementById('forgotEmail');

    // Show any auth message passed from a gated action
    const msg = sessionStorage.getItem('authMessage');
    if (msg && status) {
      status.style.display = 'inline-block';
      status.textContent = msg;
      sessionStorage.removeItem('authMessage');
    }

    tabs.forEach(btn => btn.addEventListener('click', () => {
      tabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.getAttribute('data-tab');
      if (mode === 'login') { loginForm.style.display = 'grid'; createForm.style.display = 'none'; }
      else { createForm.style.display = 'grid'; loginForm.style.display = 'none'; }
    }));
    if (loginForm) loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.style.display = 'inline-block';
      status.textContent = 'Signing in...';
      try {
        const payload = {
          email: document.getElementById('loginEmail').value,
          password: document.getElementById('loginPassword').value,
        };
        const res = await fetch('/api/auth/signin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(payload) });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Sign in failed');
        }
        status.textContent = 'Welcome back! Redirecting…';
        // Determine destination: prioritize any explicit post-login intent, else send admins to dashboard
        let dest = sessionStorage.getItem('postLoginRedirect');
        try {
          const adminRes = await fetch('/api/admin/me', { credentials: 'include' });
          const adminMe = await adminRes.json();
          if (!dest && adminMe.logged_in && adminMe.is_admin) {
            dest = '/admin/users';
          }
        } catch (_) {}
        if (!dest) dest = '/dashboard';
        if (sessionStorage.getItem('postLoginRedirect')) sessionStorage.removeItem('postLoginRedirect');
        setTimeout(() => { history.pushState({}, '', dest); render(); }, 600);
      } catch (err) {
        if (err.message === 'email not verified - please check your email') {
          status.textContent = 'Please check your email and click the verification link before signing in.';
        } else if (err.message === 'invalid credentials') {
          status.textContent = 'Invalid email or password. Please try again.';
        } else {
          status.textContent = 'Unable to sign in. Please try again.';
        }
      }
    });
    if (forgotLink) forgotLink.addEventListener('click', (e) => {
      e.preventDefault();
      if (forgotForm) {
        const visible = forgotForm.style.display !== 'none';
        forgotForm.style.display = visible ? 'none' : 'grid';
        if (!visible) {
          // prefill with login email if present
          const loginEmail = document.getElementById('loginEmail');
          if (loginEmail && loginEmail.value) forgotEmail.value = loginEmail.value;
        }
      }
    });
    if (forgotForm) forgotForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.style.display = 'inline-block';
      status.textContent = 'Sending reset link...';
      try {
        const emailVal = (forgotEmail && forgotEmail.value) || (document.getElementById('loginEmail')?.value) || '';
        const res = await fetch('/api/auth/forgot-password', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: emailVal })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'send_failed');
        status.textContent = 'If an account exists, a reset email has been sent.';
        status.style.backgroundColor = '#dcfce7';
        status.style.color = '#16a34a';
        (document.getElementById('forgotSubmitBtn')).disabled = true;
      } catch (err) {
        status.textContent = 'Unable to send reset email. Please try again later.';
        status.style.backgroundColor = '#fee2e2';
        status.style.color = '#dc2626';
      }
    });
    if (createForm) createForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.style.display = 'inline-block';
      status.textContent = 'Creating account...';
      try {
        const payload = {
          name: document.getElementById('createName').value,
          email: document.getElementById('createEmail').value,
          password: document.getElementById('createPassword').value,
        };
        const res = await fetch('/api/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Create account failed');
        }
        // Show success and, if available, a direct verification link
        if (data && data.verification_link) {
          status.innerHTML = `Account created! Please check your email to verify your account.<br/><a href="${data.verification_link}" class="btn" style="margin-top:8px;">Verify Now</a>`;
        } else {
          status.textContent = 'Account created! Please check your email to verify your account.';
        }
        // Don't redirect - user needs to verify email first
      } catch (err) {
        if (err.message === 'account already exists') {
          status.textContent = 'An account with this email already exists. Please sign in instead.';
        } else if (err.message === 'account exists but not verified - check your email') {
          status.textContent = 'Account exists but not verified. Please check your email for the verification link.';
        } else if (err.message === 'password must be at least 6 characters') {
          status.textContent = 'Password must be at least 6 characters long.';
        } else {
          status.textContent = 'Unable to create account. Please try again.';
        }
      }
    });
  },
  "/reset-password": () => {
    const status = document.getElementById('resetStatus');
    const form = document.getElementById('resetForm');
    const p1 = document.getElementById('resetPassword');
    const p2 = document.getElementById('resetPassword2');
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (!token && status) {
      status.style.display = 'inline-block';
      status.textContent = 'No reset token provided.';
      status.style.backgroundColor = '#fee2e2';
      status.style.color = '#dc2626';
      return;
    }
    if (form) form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.style.display = 'inline-block';
      status.textContent = 'Updating password...';
      try {
        if (!p1.value || p1.value.length < 8) throw new Error('password_too_short');
        if (p1.value !== p2.value) throw new Error('password_mismatch');
        const res = await fetch('/api/auth/reset-password', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, new_password: p1.value })
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || 'reset_failed');
        status.textContent = 'Password updated. You can now sign in.';
        status.style.backgroundColor = '#dcfce7';
        status.style.color = '#16a34a';
        setTimeout(() => { history.pushState({}, '', '/signin'); render(); }, 1000);
      } catch (err) {
        if (err.message === 'password_too_short') {
          status.textContent = 'Password must be at least 8 characters.';
        } else if (err.message === 'password_mismatch') {
          status.textContent = 'Passwords do not match. Please try again.';
        } else {
          status.textContent = 'Unable to reset password. The link may be invalid or expired.';
        }
        status.style.backgroundColor = '#fee2e2';
        status.style.color = '#dc2626';
      }
    });
  },
  "/admin": async () => {
    // Unified admin handler: controls login and tabbed content
    const loginForm = document.getElementById('adminLoginForm');
    const loginStatus = document.getElementById('adminLoginStatus');
    const shell = document.getElementById('adminShell');
    const tabContent = document.getElementById('adminTabContent');

    const isAdminSession = async () => {
      try {
        const meRes = await fetch(`${window.API_BASE_URL}/api/admin/me`, { credentials: 'include' });
        const me = await meRes.json();
        return !!(me && me.logged_in && me.is_admin);
      } catch (_) {
        return false;
      }
    };

    const currentTab = (() => {
      const url = new URL(window.location.href);
      const explicit = (url.searchParams.get('tab') || '').trim();
      if (explicit) return explicit;
      const path = window.location.pathname;
      if (path.startsWith('/admin/users')) return 'users';
      if (path.startsWith('/admin/styles') || path === '/admin') return 'styles';
      if (path.startsWith('/admin/jobs')) return 'jobs';
      if (path.startsWith('/admin/sales')) return 'sales';
      if (path.startsWith('/admin/archive')) return 'archive';
      if (path.startsWith('/admin/account')) return 'account';
      return 'users';
    })();

    const renderAdminTab = (tab) => {
      if (!tabContent) return;
      // Minimal shells for each tab with expected element IDs
      const shells = {
        styles: `
          <div id="adminContent" style="display:none;">
            <h2>Manage Styles</h2>
            <form id="adminUploadForm" class="form" style="max-width:520px; margin-top:12px;">
              <input id="styleTitle" type="text" placeholder="Style title" style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;" />
              <input id="styleDescription" type="text" placeholder="Style description" style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;" />
              <input id="styleImageInput" type="file" accept="image/*" style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;" />
              <div class="hero-actions">
                <button id="adminUploadBtn" class="btn primary">Upload Style</button>
                <button id="adminDeleteAllBtn" class="btn" type="button">Delete ALL Styles</button>
              </div>
              <div id="adminStatus" class="pill" style="margin-top:10px; display:none;"></div>
            </form>
            <div id="stylePreview" style="display:none; margin-top:12px;">
              <img id="stylePreviewImg" alt="Preview" style="max-width:200px;border-radius:8px;border:1px solid #e5e7eb;" />
            </div>
            <h3 style="margin-top:16px;">Current Styles</h3>
            <div id="adminStylesList" class="grid"></div>
          </div>
        `,
        users: `
          <div id="adminContent" style="display:none;">
            <h2>Users</h2>
            <div id="adminUsersStatus" class="pill" style="margin-top:10px; display:none;"></div>
            <div id="adminUsersList" class="grid"></div>
          </div>
        `,
        jobs: `
          <div id="adminContent" style="display:none;">
            <h2>User Jobs</h2>
            <div id="adminJobsStatus" class="pill" style="margin-top:10px; display:none;"></div>
            <div id="adminJobsList" class="grid"></div>
          </div>
        `,
        sales: `
          <div id="adminContent" style="display:none;">
            <h2>Sales</h2>
            <form id="salesFilterForm" class="form" style="max-width:920px; margin-top:12px; display:grid; grid-template-columns: 1fr 1fr 2fr auto auto; gap:8px; align-items:end;">
              <div>
                <label class="muted" for="salesStart">Start date</label>
                <input id="salesStart" type="date" style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;" />
              </div>
              <div>
                <label class="muted" for="salesEnd">End date</label>
                <input id="salesEnd" type="date" style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;" />
              </div>
              <div>
                <label class="muted" for="salesUsername">Username/email</label>
                <input id="salesUsername" type="text" placeholder="user or email" style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;" />
              </div>
              <div>
                <button id="salesApplyBtn" class="btn" type="submit">Apply</button>
              </div>
              <div>
                <button id="salesShowAllBtn" class="btn" type="button">Show All</button>
              </div>
            </form>
            <div id="adminSalesStatus" class="pill" style="margin-top:8px; display:none;"></div>
            <div id="adminSalesList" style="margin-top:12px;"></div>
          </div>
        `,
        account: `
          <div id="adminContent" style="display:none; max-width:560px;">
            <h2>Admin Account</h2>
            <div id="adminAccountStatus" class="pill" style="margin-top:10px; display:none;"></div>
            <div id="adminAccountInfo" class="grid"></div>
          </div>
        `,
        archive: `
          <div id="adminContent" style="display:none;">
            <h2>Archive Jobs</h2>
            <form id="archiveForm" class="form" style="max-width:480px; margin-top:12px;">
              <label class="muted" for="archiveDate">Archive jobs created before:</label>
              <input id="archiveDate" type="date" required style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;" />
              <div class="hero-actions">
                <button id="archiveSubmitBtn" class="btn primary" type="submit">Archive Jobs</button>
              </div>
              <div id="archiveStatus" class="pill" style="margin-top:10px; display:none;"></div>
            </form>
            <div class="muted" style="margin-top:8px;">This will move matching jobs to the archive table and hide them from the Users view.</div>
            <hr style="margin:24px 0;" />
            <h2>Archived Jobs</h2>
            <form id="archiveFilterForm" class="form" style="max-width:720px; margin-top:12px; display:grid; grid-template-columns: 1fr 1fr auto auto auto; gap:8px; align-items:end;">
              <div>
                <label class="muted" for="filterStart">Start date</label>
                <input id="filterStart" type="date" style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;" />
              </div>
              <div>
                <label class="muted" for="filterEnd">End date</label>
                <input id="filterEnd" type="date" style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;" />
              </div>
              <div>
                <button id="filterApplyBtn" class="btn" type="submit">Apply</button>
              </div>
              <div>
                <button id="generateListBtn" class="btn" type="button">Generate List</button>
              </div>
              <div>
                <button id="showAllBtn" class="btn" type="button">Show All</button>
              </div>
            </form>
            <div class="hero-actions" style="margin-top:8px;">
              <button id="exportCsvBtn" class="btn" type="button">Export CSV</button>
            </div>
            <div id="archiveListStatus" class="pill" style="margin-top:8px; display:none;"></div>
            <div id="archivedList" class="grid" style="margin-top:12px;"></div>
          </div>
        `
      };
      tabContent.innerHTML = shells[tab] || shells['users'];
    };

    // Per-tab loaders (minimal functional)
    const loadStyles = async () => {
      const listEl = document.getElementById('adminStylesList');
      const statusEl = document.getElementById('adminStatus');
      const inputEl = document.getElementById('styleImageInput');
      const previewWrap = document.getElementById('stylePreview');
      const previewImg = document.getElementById('stylePreviewImg');
      const uploadBtn = document.getElementById('adminUploadBtn');
      const deleteAllBtn = document.getElementById('adminDeleteAllBtn');

      if (inputEl && previewWrap && previewImg) {
        inputEl.addEventListener('change', () => {
          const f = inputEl.files && inputEl.files[0];
          if (f) {
            const url = URL.createObjectURL(f);
            previewImg.src = url;
            previewWrap.style.display = 'block';

            // Auto-fill style title from selected file name, without extension (e.g., .png)
            const titleInput = document.getElementById('styleTitle');
            if (titleInput) {
              const rawName = String(f.name || '').trim();
              // Remove common image extensions; .png specifically requested, include others for robustness
              const nameWithoutExt = rawName.replace(/\.(png|jpg|jpeg|gif|webp)$/i, '');
              titleInput.value = nameWithoutExt || rawName;
            }
          } else {
            previewWrap.style.display = 'none';
            previewImg.src = '';
          }
        });
      }

      const refresh = async () => {
        try {
          const r = await fetch(`${window.API_BASE_URL}/api/styles`, { credentials: 'include' });
          const d = await r.json();
          if (!r.ok) throw new Error(d.error || 'load_failed');
          // Sort styles by numeric order from filename/title (e.g., style-m-1, style-m-2)
          const items = (d.data || []).slice().sort((a, b) => {
            const af = String(a.original_filename || a.title || '').trim();
            const bf = String(b.original_filename || b.title || '').trim();
            const am = af.match(/(\d+)/);
            const bm = bf.match(/(\d+)/);
            const an = am ? parseInt(am[1], 10) : Number.POSITIVE_INFINITY;
            const bn = bm ? parseInt(bm[1], 10) : Number.POSITIVE_INFINITY;
            if (an !== bn) return an - bn;
            return af.localeCompare(bf, undefined, { numeric: true, sensitivity: 'base' });
          });
          const rows = [];
          for (let i = 0; i < items.length; i += 5) {
            rows.push(items.slice(i, i + 5));
          }

          const renderCell = (s) => {
            const prev = `${window.API_BASE_URL}/api/styles/${s.id}/preview`;
            return `
              <td style="vertical-align:top; padding:8px; width:20%;">
                <div class="card" style="height:280px; display:flex; flex-direction:column;">
                  <img src="${prev}" alt="${s.title}" style="width:100%; height:160px; object-fit:cover; border-radius:8px; border:1px solid #e5e7eb; background:#fff;" />
                  <div class="body" style="padding:8px; display:flex; flex-direction:column; gap:6px; flex:1;">
                    <div class="title" style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${s.title}</div>
                    <div class="muted" style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${s.description || ''}</div>
                    <div class="actions" style="margin-top:auto;">
                      <button class="btn delete-style" data-id="${s.id}">Delete</button>
                    </div>
                  </div>
                </div>
              </td>
            `;
          };

          const tableHtml = rows.length ? `
            <table style="width:100%; border-collapse:separate; border-spacing:8px;">
              <tbody>
                ${rows.map(row => `
                  <tr>
                    ${row.map(renderCell).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : `<div class="muted" style="padding:12px;">No styles found.</div>`;

          listEl.innerHTML = tableHtml;
          listEl.querySelectorAll('.delete-style').forEach(btn => {
            btn.addEventListener('click', async () => {
              const confirmDelete = window.confirm('Are you sure you want to delete this style?');
              if (!confirmDelete) return;
              const id = btn.getAttribute('data-id');
              try {
                const del = await fetch(`${window.API_BASE_URL}/api/styles/${id}`, { method: 'DELETE', credentials: 'include' });
                const dd = await del.json();
                if (!del.ok) throw new Error(dd.error || 'delete_failed');
                await refresh();
              } catch (e) {
                if (statusEl) { statusEl.style.display = 'inline-block'; statusEl.textContent = `Delete failed: ${e.message}`; }
              }
            });
          });
        } catch (e) {
          if (statusEl) { statusEl.style.display = 'inline-block'; statusEl.textContent = `Load failed: ${e.message}`; }
        }
      };

      if (uploadBtn) uploadBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        if (statusEl) { statusEl.style.display = 'inline-block'; statusEl.textContent = 'Uploading...'; }
        try {
          const title = document.getElementById('styleTitle').value || '';
          const description = document.getElementById('styleDescription').value || '';
          const file = inputEl && inputEl.files && inputEl.files[0];
          if (!file || !title) throw new Error('missing_fields');

          // Convert file to base64 Data URL to match API contract
          const dataUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = (err) => reject(err);
            reader.readAsDataURL(file);
          });

          const payload = {
            title,
            description,
            imageData: String(dataUrl || ''),
            fileName: file.name || 'upload.png'
          };

          const r = await fetch(`${window.API_BASE_URL}/api/styles`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            credentials: 'include'
          });
          const d = await r.json();
          if (!r.ok) throw new Error(d.error || 'upload_failed');
          if (statusEl) { statusEl.textContent = 'Uploaded.'; }
          // Clear chooser
          if (inputEl) inputEl.value = '';
          if (previewWrap) previewWrap.style.display = 'none';
          if (previewImg) previewImg.src = '';
          await refresh();
        } catch (e) {
          if (statusEl) { statusEl.textContent = `Upload failed: ${e.message}`; }
        }
      });

      if (deleteAllBtn) deleteAllBtn.addEventListener('click', async () => {
        try {
          const r = await fetch(`${window.API_BASE_URL}/api/styles/delete-all`, { method: 'POST', credentials: 'include' });
          const d = await r.json();
          if (!r.ok) throw new Error(d.error || 'delete_all_failed');
          await refresh();
        } catch (e) {
          if (statusEl) { statusEl.style.display = 'inline-block'; statusEl.textContent = `Delete all failed: ${e.message}`; }
        }
      });

      await refresh();
      const content = document.getElementById('adminContent');
      if (content) content.style.display = 'block';
    };

    // Helper: show full Job ID in a lightweight popup
    window.showFullJobId = (id) => {
      try {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.inset = '0';
        overlay.style.background = 'rgba(0,0,0,0.35)';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.zIndex = '9999';

        const box = document.createElement('div');
        box.style.background = '#fff';
        box.style.borderRadius = '8px';
        box.style.padding = '16px 20px';
        box.style.minWidth = '320px';
        box.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';

        box.innerHTML = `
          <div style="font-size:16px; font-weight:600; margin-bottom:8px;">Full Job ID</div>
          <div id="jobIdValue" style="font-family: monospace; word-break: break-all;">${id}</div>
          <div style="margin-top:12px; display:flex; justify-content:flex-end; gap:8px; align-items:center;">
            <button class="btn" id="jobIdCopyBtn">Copy</button>
            <span id="jobIdCopyStatus" style="font-size:12px; color:#4b5563; display:none;">Copied!</span>
            <button class="btn" id="jobIdCloseBtn">Close</button>
          </div>
        `;

        overlay.appendChild(box);
        document.body.appendChild(overlay);

        const close = () => { try { document.body.removeChild(overlay); } catch(_) {} };
        overlay.addEventListener('click', close);
        box.addEventListener('click', (e) => e.stopPropagation());
        const closeBtn = box.querySelector('#jobIdCloseBtn');
        if (closeBtn) closeBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); close(); });

        const copyBtn = box.querySelector('#jobIdCopyBtn');
        const statusEl = box.querySelector('#jobIdCopyStatus');
        if (copyBtn) {
          copyBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            try {
              if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(String(id));
              } else {
                const ta = document.createElement('textarea');
                ta.value = String(id);
                ta.setAttribute('readonly', '');
                ta.style.position = 'absolute';
                ta.style.left = '-9999px';
                document.body.appendChild(ta);
                ta.select();
                try { document.execCommand('copy'); } catch (_) {}
                document.body.removeChild(ta);
              }
              if (statusEl) {
                statusEl.style.display = 'inline';
                setTimeout(() => { statusEl.style.display = 'none'; }, 1500);
              }
            } catch (_) {
              // As a last resort, show the ID so the user can copy manually
              alert(`Job ID: ${id}`);
            }
          });
        }
      } catch (_) {
        // Fallback to alert if DOM manipulation fails
        alert(`Job ID: ${id}`);
      }
    };

    const loadUsers = async () => {
      const statusEl = document.getElementById('adminUsersStatus');
      const listEl = document.getElementById('adminUsersList');
      try {
        const r = await fetch(`${window.API_BASE_URL}/api/admin/users`, { credentials: 'include' });
        const d = await r.json();
        if (!r.ok) throw new Error(d.error || 'load_failed');

        const users = d.data || [];
        listEl.innerHTML = users.map(u => {
          const jobs = Array.isArray(u.jobs) ? u.jobs : [];

          const tableHeader = `
            <thead>
              <tr>
                <th style="text-align:left; padding:8px;">Photo</th>
                <th style="text-align:left; padding:8px;">Style</th>
                <th style="text-align:left; padding:8px;">Date</th>
                <th style="text-align:left; padding:8px;">Status</th>
                <th style="text-align:left; padding:8px;">Result</th>
                <th style="text-align:left; padding:8px;">Job ID</th>
                <th style="text-align:left; padding:8px;">Standard Link</th>
                <th style="text-align:left; padding:8px;">Upscale Link</th>
              </tr>
            </thead>
          `;

          const jobRows = jobs.map(j => {
            // Prefer server redirect that presigns/streams the style preview.
            // Fallback to stored preview_url only if style_id is missing.
            const stylePreviewSrc = j.style_id ? `${window.API_BASE_URL}/api/styles/${j.style_id}/preview` : (j.style_preview_url || '');
            const uploadedSrc = j.photo_url || (j.upload_s3_key ? `${window.API_BASE_URL}/api/jobs/${j.id}/photo` : '');
            const resultSrc = (j.composite_url || j.result_url || (j.result_s3_key ? `${window.API_BASE_URL}/api/jobs/${j.id}/result` : ''));
            const upscaledSrc = j.composite_upscaled_url || '';
            const created = j.created_at ? new Date(j.created_at).toLocaleDateString() : '—';

            const imgCell = (src) => src ? `<img src="${src}" alt="" style="width:96px;height:96px;object-fit:cover;border-radius:8px;" />` : '—';
            const viewBtn = resultSrc ? `<a class="btn" href="${resultSrc}" target="_blank" rel="noopener noreferrer">View</a>` : '<span class="muted">NA</span>';
            const upscaleBtn = upscaledSrc ? `<a class="btn" href="${upscaledSrc}" target="_blank" rel="noopener noreferrer">Upscale</a>` : 'NA';
            const shortId = String(j.id || '').slice(0, 8);
            const jobLink = `<a href="#" onclick="event.preventDefault(); event.stopPropagation(); window.showFullJobId && window.showFullJobId('${String(j.id || '')}');">${shortId}</a>`;

            return `
              <tr>
                <td style="padding:8px;">${imgCell(uploadedSrc)}</td>
                <td style="padding:8px;">${imgCell(stylePreviewSrc)}</td>
                <td style="padding:8px;">${created}</td>
                <td style="padding:8px;">${j.status || '—'}</td>
                <td style="padding:8px;">${imgCell(resultSrc)}</td>
                <td style="padding:8px;">${jobLink}</td>
                <td style="padding:8px;">${viewBtn}</td>
                <td style="padding:8px;">${upscaleBtn}</td>
              </tr>
            `;
          }).join('');

          const table = `
            <table style="width:100%; border-collapse:separate; border-spacing:0 8px;">
              ${tableHeader}
              <tbody>
                ${jobs.length ? jobRows : '<tr><td colspan="8" class="muted" style="padding:12px;">No jobs for this user.</td></tr>'}
              </tbody>
            </table>
          `;

          return `
            <details class="card" style="overflow:hidden;">
              <summary style="cursor:pointer; list-style:none;">
                <div class="body">
                  <div class="title">${u.email || u.name || '—'}</div>
                  <div class="muted">User ID: ${u.id || u.user_id || '—'} • Jobs: ${jobs.length}</div>
                </div>
              </summary>
              <div style="padding:12px;">
                ${table}
              </div>
            </details>
          `;
        }).join('');

        const content = document.getElementById('adminContent');
        if (content) content.style.display = 'block';
      } catch (e) {
        if (statusEl) { statusEl.style.display = 'inline-block'; statusEl.textContent = `Load failed: ${e.message}`; }
      }
    };

    const loadAccount = async () => {
      const statusEl = document.getElementById('adminAccountStatus');
      const infoEl = document.getElementById('adminAccountInfo');
      try {
        const r = await fetch(`${window.API_BASE_URL}/api/admin/me`, { credentials: 'include' });
        const d = await r.json();
        if (!r.ok) throw new Error(d.error || 'load_failed');
        infoEl.innerHTML = `
          <div class="grid" style="max-width:480px;">
            <div><strong>Email</strong></div><div>${d.user?.email || '—'}</div>
            <div><strong>Is Admin</strong></div><div>${d.is_admin ? 'Yes' : 'No'}</div>
          </div>
        `;
        const content = document.getElementById('adminContent');
        if (content) content.style.display = 'block';
      } catch (e) {
        if (statusEl) { statusEl.style.display = 'inline-block'; statusEl.textContent = `Load failed: ${e.message}`; }
      }
    };

    const loadArchive = async () => {
      const listEl = document.getElementById('archivedList');
      const statusEl = document.getElementById('archiveListStatus');
      const formEl = document.getElementById('archiveForm');
      const formStatus = document.getElementById('archiveStatus');
      const filterForm = document.getElementById('archiveFilterForm');
      const exportBtn = document.getElementById('exportCsvBtn');

      const refresh = async (start = '', end = '') => {
        try {
          const params = new URLSearchParams();
          if (start) params.set('start', start);
          if (end) params.set('end', end);
          const url = `${window.API_BASE_URL}/api/admin/jobs/archive-list${params.toString() ? ('?' + params.toString()) : ''}`;
          const r = await fetch(url, { credentials: 'include' });
          const d = await r.json();
          if (!r.ok) throw new Error(d.error || 'load_failed');
          const items = d.items || [];
          const tableHeader = `
            <thead>
              <tr>
                <th style="text-align:left; padding:8px;">Photo</th>
                <th style="text-align:left; padding:8px;">Style</th>
                <th style="text-align:left; padding:8px;">Result</th>
                <th style="text-align:left; padding:8px;">User Email</th>
                <th style="text-align:left; padding:8px;">Amount</th>
                <th style="text-align:left; padding:8px;">Status</th>
                <th style="text-align:left; padding:8px;">Created</th>
                <th style="text-align:left; padding:8px;">Archived</th>
                <th style="text-align:left; padding:8px;">Job ID</th>
              </tr>
            </thead>
          `;

          const imgCell = (src) => src ? `<img src="${src}" alt="" style="width:96px;height:96px;object-fit:cover;border-radius:8px;" />` : '—';

          const rows = items.map(j => {
            const stylePreviewSrc = j.style_id ? `${window.API_BASE_URL}/api/styles/${j.style_id}/preview` : (j.style_preview_url || '');
            const created = j.created_at ? new Date(j.created_at).toLocaleString() : '—';
            const archived = j.archived_at ? new Date(j.archived_at).toLocaleString() : '—';
            const shortId = String(j.job_id || '').slice(0, 8);
            const jobLink = shortId ? `<a href="#" onclick="event.preventDefault(); window.showFullJobId && window.showFullJobId('${String(j.job_id || '')}');">${shortId}</a>` : '—';
            const amount = (j.amount_cents != null) ? `$${Number(j.amount_cents).toFixed(2)}` : '—';
            return `
              <tr>
                <td style="padding:8px;">${imgCell(j.photo_url)}</td>
                <td style="padding:8px;">${imgCell(stylePreviewSrc)}</td>
                <td style="padding:8px;">${imgCell(j.result_url || j.composite_url)}</td>
                <td style="padding:8px;">${j.user_email || '—'}</td>
                <td style="padding:8px;">${amount}</td>
                <td style="padding:8px;">${j.status || '—'}</td>
                <td style="padding:8px;">${created}</td>
                <td style="padding:8px;">${archived}</td>
                <td style="padding:8px;">${jobLink}</td>
              </tr>
            `;
          }).join('');

          const table = `
            <table style="width:100%; border-collapse:separate; border-spacing:0 8px;">
              ${tableHeader}
              <tbody>
                ${items.length ? rows : '<tr><td colspan="9" class="muted" style="padding:12px;">No archived jobs found.</td></tr>'}
              </tbody>
            </table>
          `;

          const filterInfo = (start || end) ? `<div class="muted" style="margin-bottom:8px;">Showing archives${start ? ` from ${start}` : ''}${end ? ` to ${end}` : ''}.</div>` : '';

          listEl.innerHTML = `${filterInfo}${table}`;
          const content = document.getElementById('adminContent');
          if (content) content.style.display = 'block';
        } catch (e) {
          if (statusEl) { statusEl.style.display = 'inline-block'; statusEl.textContent = `Load failed: ${e.message}`; }
        }
      };

      if (formEl) formEl.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (formStatus) { formStatus.style.display = 'inline-block'; formStatus.textContent = 'Archiving...'; }
        try {
          const dt = document.getElementById('archiveDate').value;
          const r = await fetch(`${window.API_BASE_URL}/api/admin/jobs/archive-batch`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ before_date: dt }), credentials: 'include' });
          const d = await r.json();
          if (!r.ok) throw new Error(d.error || 'archive_failed');
          formStatus.textContent = 'Archived.';
          await refresh();
        } catch (e) {
          if (formStatus) { formStatus.textContent = `Archive failed: ${e.message}`; }
        }
      });

      if (filterForm) filterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const s = document.getElementById('filterStart').value || '';
        const e2 = document.getElementById('filterEnd').value || '';
        await refresh(s, e2);
      });

      if (exportBtn) exportBtn.addEventListener('click', async () => {
        try {
          const s = document.getElementById('filterStart').value || '';
          const e2 = document.getElementById('filterEnd').value || '';
          const params = new URLSearchParams();
          if (s) params.set('start', s);
          if (e2) params.set('end', e2);
          const url = `${window.API_BASE_URL}/api/admin/jobs/archive-list${params.toString() ? ('?' + params.toString()) : ''}`;
          const r = await fetch(url, { credentials: 'include' });
          const d = await r.json();
          if (!r.ok) throw new Error(d.error || 'export_failed');
          const items = d.items || [];
          const csvHeader = 'job_id,user_email,amount_cents,status,created_at,archived_at,style_id';
          const csvRows = items.map(j => [
            j.job_id,
            j.user_email || '',
            j.amount_cents != null ? Number(j.amount_cents).toFixed(2) : '',
            j.status || '',
            j.created_at || '',
            j.archived_at || '',
            j.style_id || ''
          ].join(','));
          const csv = [csvHeader].concat(csvRows).join('\n');
          const blob = new Blob([csv], { type: 'text/csv' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = 'archived_jobs.csv';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (e) {
          if (statusEl) { statusEl.style.display = 'inline-block'; statusEl.textContent = `Export failed: ${e.message}`; }
        }
      });

      await refresh();
    };

    const loadJobs = async () => {
      const statusEl = document.getElementById('adminJobsStatus');
      const listEl = document.getElementById('adminJobsList');
      try {
        // Minimal: show current user's jobs (admin user may have none)
        const r = await fetch(`${window.API_BASE_URL}/api/jobs`, { credentials: 'include' });
        const d = await r.json();
        if (!r.ok) throw new Error(d.error || 'load_failed');
        listEl.innerHTML = (d.data || []).map(job => {
          const stylePreviewSrc = `${window.API_BASE_URL}/api/styles/${job.style_id}/preview`;
          const resultImgSrc = job.has_result ? `${window.API_BASE_URL}/api/jobs/${job.id}/result` : '';
          return `
            <div class="card">
              <img src="${stylePreviewSrc}" alt="${job.style_title}" />
              <div class="body">
                <div class="title">Job ${job.id}</div>
                <div class="muted">Status: ${job.status}</div>
                ${resultImgSrc ? `<div><img src="${resultImgSrc}" alt="result" /></div>` : ''}
              </div>
            </div>
          `;
        }).join('');
        const content = document.getElementById('adminContent');
        if (content) content.style.display = 'block';
      } catch (e) {
        if (statusEl) { statusEl.style.display = 'inline-block'; statusEl.textContent = `Load failed: ${e.message}`; }
      }
    };

    const loadSales = async () => {
      const statusEl = document.getElementById('adminSalesStatus');
      const listEl = document.getElementById('adminSalesList');
      const formEl = document.getElementById('salesFilterForm');
      const startEl = document.getElementById('salesStart');
      const endEl = document.getElementById('salesEnd');
      const userEl = document.getElementById('salesUsername');
      const showAllBtn = document.getElementById('salesShowAllBtn');

      const renderRows = (items) => {
        const header = `
          <thead>
            <tr>
              <th style="text-align:left; padding:8px;">User</th>
              <th style="text-align:left; padding:8px;">Uploaded</th>
              <th style="text-align:left; padding:8px;">Style</th>
              <th style="text-align:left; padding:8px;">Job ID</th>
              <th style="text-align:left; padding:8px;">Standard</th>
              <th style="text-align:left; padding:8px;">Upscaled</th>
              <th style="text-align:left; padding:8px;">Price Paid</th>
              <th style="text-align:left; padding:8px;">Date</th>
            </tr>
          </thead>
        `;

        const cellImg = (src) => src ? `<img src="${src}" alt="" style="width:96px;height:96px;object-fit:cover;border-radius:8px;" />` : '<span class="muted">—</span>';
        const cellLink = (href, label) => href ? `<a class="btn" href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>` : '<span class="muted">NA</span>';
        const cellJob = (id) => {
          const shortId = String(id || '').slice(0, 8);
          return id ? `<a href="#" onclick="event.preventDefault(); event.stopPropagation(); window.showFullJobId && window.showFullJobId('${String(id)}');">${shortId}</a>` : '—';
        };

        const body = items.map(it => {
          const uploadedSrc = it.photo_url || (it.upload_s3_key ? `${window.API_BASE_URL}/api/jobs/${it.job_id}/photo` : '');
          const stylePreviewSrc = it.style_id ? `${window.API_BASE_URL}/api/styles/${it.style_id}/preview` : (it.style_preview_url || '');
          const standardSrc = it.composite_url || it.result_url || (it.result_s3_key ? `${window.API_BASE_URL}/api/jobs/${it.job_id}/result` : '');
          const upscaledSrc = it.composite_upscaled_url || '';
          const amount = (it.amount_cents != null) ? `$${Number(it.amount_cents).toFixed(2)}` : '—';
          const created = it.created_at ? new Date(it.created_at).toLocaleDateString() : '—';
          const userLabel = [it.user_email, it.user_name].filter(Boolean).join(' • ');

          return `
            <tr>
              <td style="padding:8px;">${userLabel || '—'}</td>
              <td style="padding:8px;">${cellImg(uploadedSrc)}</td>
              <td style="padding:8px;">${cellImg(stylePreviewSrc)}</td>
              <td style="padding:8px;">${cellJob(it.job_id)}</td>
              <td style="padding:8px;">${cellLink(standardSrc, 'View')}</td>
              <td style="padding:8px;">${cellLink(upscaledSrc, 'Upscale')}</td>
              <td style="padding:8px;">${amount}</td>
              <td style="padding:8px;">${created}</td>
            </tr>
          `;
        }).join('');

        return `
          <table style="width:100%; border-collapse:separate; border-spacing:0 8px;">
            ${header}
            <tbody>
              ${items.length ? body : '<tr><td colspan="8" class="muted" style="padding:12px;">No sales found.</td></tr>'}
            </tbody>
          </table>
        `;
      };

      const refresh = async () => {
        try {
          const params = new URLSearchParams();
          const start = (startEl && startEl.value) ? startEl.value : '';
          const end = (endEl && endEl.value) ? endEl.value : '';
          const uname = (userEl && userEl.value) ? userEl.value.trim() : '';
          if (start) params.set('start', start);
          if (end) params.set('end', end);
          if (uname) params.set('username', uname);
          const qs = params.toString();
          if (statusEl) { statusEl.style.display = 'inline-block'; statusEl.textContent = 'Loading sales...'; }
          const r = await fetch(`${window.API_BASE_URL}/api/admin/sales/list${qs ? ('?' + qs) : ''}`, { credentials: 'include' });
          const d = await r.json();
          if (!r.ok) throw new Error(d.error || 'load_failed');
          listEl.innerHTML = renderRows(d.items || []);
          const content = document.getElementById('adminContent');
          if (content) content.style.display = 'block';
          if (statusEl) { statusEl.style.display = 'none'; }
        } catch (e) {
          if (statusEl) { statusEl.style.display = 'inline-block'; statusEl.textContent = `Load failed: ${e.message}`; }
          const content = document.getElementById('adminContent');
          if (content) content.style.display = 'block';
          if (listEl) listEl.innerHTML = '<div class="muted">Unable to load sales. Please check admin login or try again.</div>';
        }
      };

      if (formEl) {
        formEl.addEventListener('submit', (e) => { e.preventDefault(); refresh(); });
      }
      if (showAllBtn) {
        showAllBtn.addEventListener('click', () => {
          if (startEl) startEl.value = '';
          if (endEl) endEl.value = '';
          if (userEl) userEl.value = '';
          refresh();
        });
      }

      await refresh();
    };

    // Admin login handler (top-level)
    if (loginForm) loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (loginStatus) { loginStatus.style.display = 'inline-block'; loginStatus.textContent = 'Logging in...'; }
      try {
        const payload = { email: document.getElementById('adminLoginEmail').value, password: document.getElementById('adminLoginPassword').value };
        const res = await fetch(`${window.API_BASE_URL}/api/auth/admin/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), credentials: 'include' });
        const out = await res.json();
        if (!res.ok) throw new Error(out.error || 'Login failed');
        if (loginStatus) loginStatus.textContent = 'Logged in.';
        setTimeout(() => { history.pushState({}, '', '/admin?tab=users'); render(); }, 600);
      } catch (err) {
        if (loginStatus) loginStatus.textContent = `Login failed: ${err.message}`;
      }
    });

    // Check admin session and render appropriate shell
    const ok = await isAdminSession();
    if (ok) {
      if (shell) shell.style.display = 'block';
      if (loginForm) loginForm.style.display = 'none';
      renderAdminTab(currentTab);
      if (currentTab === 'styles') await loadStyles();
      else if (currentTab === 'users') await loadUsers();
      else if (currentTab === 'jobs') await loadJobs();
      else if (currentTab === 'sales') await loadSales();
      else if (currentTab === 'account') await loadAccount();
      else if (currentTab === 'archive') await loadArchive();
    } else {
      if (shell) shell.style.display = 'none';
      if (loginForm) loginForm.style.display = 'block';
    }
  },
  "/admin/styles": async () => { if (afterRender["/admin"]) await afterRender["/admin"](); },
  "/admin/users": async () => { if (afterRender["/admin"]) await afterRender["/admin"](); },
  "/admin/jobs": async () => { if (afterRender["/admin"]) await afterRender["/admin"](); },
  "/admin/account": async () => { if (afterRender["/admin"]) await afterRender["/admin"](); },
  "/admin/archive": async () => { if (afterRender["/admin"]) await afterRender["/admin"](); },
  "/verify-email": async () => {
    const status = document.getElementById('verifyStatus');
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (!token) {
      status.textContent = 'No verification token provided.';
      status.style.backgroundColor = '#fee2e2';
      status.style.color = '#dc2626';
      return;
    }
    // Perform a full navigation to the backend so cookies and redirects apply
    window.location.href = `/api/auth/verify-email?token=${token}`;
  },
  "/checkout": async () => {
    const btn = document.getElementById('proceedCheckoutBtn');
    const status = document.getElementById('checkoutStatus');
    const linkEl = document.getElementById('paymentLinkDebug');
    const jobIdEl = document.getElementById('jobIdDebug');
    if (!btn) return;
    // Precompute and show the payment link for visibility
    try {
      const meRes0 = await fetch('/api/auth/me');
      const me0 = await meRes0.json();
      if (me0.logged_in) {
        let styleId0 = sessionStorage.getItem('styleId') || '';
        let jobId0 = sessionStorage.getItem('jobId') || '';
        let styleName0 = sessionStorage.getItem('styleTitle') || '';
        let styleFilename0 = sessionStorage.getItem('styleFilename') || '';
        if (!jobId0 || !styleId0 || !styleName0) {
          try {
            const resp0 = await fetch('/api/jobs');
            const data0 = await resp0.json();
            if (resp0.ok && data0.data && data0.data.length > 0) {
              const latest0 = data0.data[0];
              if (!jobId0) { jobId0 = latest0.id; sessionStorage.setItem('jobId', jobId0); }
              if (!styleId0 && latest0.style_id) { styleId0 = latest0.style_id; sessionStorage.setItem('styleId', styleId0); }
              if (!styleName0 && latest0.style_title) { styleName0 = latest0.style_title; sessionStorage.setItem('styleTitle', styleName0); }
            }
          } catch (_) {}
        }
        // Resolve original filename for style_name if not present
        if (!styleFilename0 && styleId0) {
          try {
            const stylesRes0 = await fetch('/api/styles');
            const stylesData0 = await stylesRes0.json();
            const match0 = (stylesData0.data || []).find(s => String(s.id) === String(styleId0));
            if (match0 && match0.original_filename) {
              styleFilename0 = match0.original_filename;
              sessionStorage.setItem('styleFilename', styleFilename0);
            }
          } catch (_) {}
        }
        const userId0 = (me0 && me0.user && (me0.user.id || me0.user.user_id)) ? (me0.user.id || me0.user.user_id) : '';
        const base0 = 'https://buy.stripe.com/test_fZufZg7iCcRI6GO62D00002';
        const params0 = new URLSearchParams({
          style_id: styleId0,
          job_id: jobId0,
          style_name: styleFilename0 || styleName0,
          user_id: String(userId0 || '')
        });
        const url0 = `${base0}?${params0.toString()}`;
        if (linkEl) {
          linkEl.href = url0;
          linkEl.textContent = 'Payment Link';
          linkEl.style.display = 'inline-block';
        }
        if (jobIdEl) {
          jobIdEl.textContent = `job_id: ${jobId0}`;
          jobIdEl.style.display = 'inline';
        }
        console.log('Stripe Payment Link:', url0);
      }
    } catch (_) {}
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      // Ensure the user is logged in
      try {
        const meRes = await fetch('/api/auth/me');
        const me = await meRes.json();
        if (!me.logged_in) {
          sessionStorage.setItem('postLoginRedirect', '/checkout');
          sessionStorage.setItem('authMessage', 'Please sign in to complete checkout.');
          history.pushState({}, '', '/signin');
          render();
          return;
        }
      } catch (_) {}
      let me = null;
      try {
        const meRes = await fetch('/api/auth/me');
        me = await meRes.json();
        if (!me.logged_in) {
          sessionStorage.setItem('postLoginRedirect', '/checkout');
          sessionStorage.setItem('authMessage', 'Please sign in to complete checkout.');
          history.pushState({}, '', '/signin');
          render();
          return;
        }
      } catch (_) {}
      
      // Redirect directly to provided Stripe payment link
      status.style.display = 'inline-block';
      status.textContent = 'Redirecting to payment...';
      let styleId = sessionStorage.getItem('styleId') || '';
      let jobId = sessionStorage.getItem('jobId') || '';
      let styleName = sessionStorage.getItem('styleTitle') || '';
      let styleFilename = sessionStorage.getItem('styleFilename') || '';
      if (!jobId || !styleId || !styleName) {
        try {
          const resp = await fetch('/api/jobs');
          const data = await resp.json();
          if (resp.ok && data.data && data.data.length > 0) {
            const latest = data.data[0]; // ordered by created_at DESC
            if (!jobId) { jobId = latest.id; sessionStorage.setItem('jobId', jobId); }
            if (!styleId && latest.style_id) { styleId = latest.style_id; sessionStorage.setItem('styleId', styleId); }
            if (!styleName && latest.style_title) { styleName = latest.style_title; sessionStorage.setItem('styleTitle', styleName); }
          }
        } catch (_) {}
        if (!styleFilename && styleId) {
          try {
            const stylesRes = await fetch('/api/styles');
            const stylesData = await stylesRes.json();
            const match = (stylesData.data || []).find(s => String(s.id) === String(styleId));
            if (match && match.original_filename) {
              styleFilename = match.original_filename;
              sessionStorage.setItem('styleFilename', styleFilename);
            }
          } catch (_) {}
        }
      }
      const userId = (me && me.user && (me.user.id || me.user.user_id)) ? (me.user.id || me.user.user_id) : '';
      const base = 'https://buy.stripe.com/test_fZufZg7iCcRI6GO62D00002';
      const params = new URLSearchParams({
        style_id: styleId,
        job_id: jobId,
        style_name: styleFilename || styleName,
        user_id: String(userId || '')
      });
      window.location.href = `${base}?${params.toString()}`;
    });
  },
  "/dashboard": async () => {
    // Removed admin redirect: admins can view the user dashboard normally

    const orderList = document.getElementById('orderList');
    const status = document.getElementById('dashboardStatus');
    const tabs = document.querySelectorAll('.tab');
    const jobsSection = document.getElementById('jobsSection');
    const accountSection = document.getElementById('accountSection');
    const accountEmail = document.getElementById('accountEmail');
    const accountSignup = document.getElementById('accountSignup');
    const accountStatus = document.getElementById('accountStatus');
    const resetBtn = document.getElementById('resetPasswordBtn');
    
    if (!orderList) return;
    
    // Tabs switcher
    if (tabs && tabs.length) {
      tabs.forEach(btn => btn.addEventListener('click', () => {
        tabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tab = btn.getAttribute('data-tab');
        if (tab === 'account') {
          jobsSection.style.display = 'none';
          accountSection.style.display = 'block';
        } else {
          accountSection.style.display = 'none';
          jobsSection.style.display = 'block';
        }
      }));
    }

    // Check if user is logged in first
    try {
      const meRes = await fetch('/api/auth/me');
      const me = await meRes.json();
      if (!me.logged_in) {
        orderList.innerHTML = `
          <div style="text-align:center; padding:40px;">
            <p class="muted">Please sign in to view your portraits.</p>
            <a href="/signin" class="btn primary" data-route>Sign In</a>
          </div>
        `;
        if (accountSection) {
          accountSection.innerHTML = `
            <div class="pill" style="display:inline-block;">Please sign in to view account information.</div>
          `;
        }
        return;
      }

      // Populate account info
      if (accountEmail) accountEmail.textContent = me.user?.email || '—';
      if (accountSignup) {
        const d = me.user?.created_at ? new Date(me.user.created_at) : null;
        accountSignup.textContent = d ? d.toLocaleString() : '—';
      }

      // Reset password trigger
      if (resetBtn) resetBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        if (accountStatus) {
          accountStatus.style.display = 'inline-block';
          accountStatus.textContent = 'Sending reset link...';
          accountStatus.style.backgroundColor = '';
          accountStatus.style.color = '';
        }
        try {
          const emailVal = me.user?.email || '';
          const res = await fetch('/api/auth/forgot-password', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: emailVal })
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'send_failed');
          if (accountStatus) {
            accountStatus.textContent = 'If your account exists, a reset email has been sent.';
            accountStatus.style.backgroundColor = '#dcfce7';
            accountStatus.style.color = '#16a34a';
          }
        } catch (err) {
          if (accountStatus) {
            accountStatus.textContent = 'Unable to send reset email. Please try again.';
            accountStatus.style.backgroundColor = '#fee2e2';
            accountStatus.style.color = '#dc2626';
          }
        }
      });
    } catch (err) {
      orderList.innerHTML = `
        <div style="text-align:center; padding:40px;">
          <p class="muted">Please sign in to view your portraits.</p>
          <a href="/signin" class="btn primary" data-route>Sign In</a>
        </div>
      `;
      return;
    }
    
    // Show verification success message if redirected from email verification
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('verified') === 'true') {
      status.style.display = 'inline-block';
      status.style.backgroundColor = '#dcfce7';
      status.style.color = '#16a34a';
      status.textContent = 'Email verified successfully! Welcome to Regal Pet Portraits.';
      // Clean up URL
      history.replaceState({}, '', '/dashboard');
    }
    
    // Fetch user's jobs
    try {
      const response = await fetch('/api/jobs');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load jobs');
      }
      
      if (data.data && data.data.length > 0) {
        orderList.innerHTML = [
          `<div class="orders-header">`
          , `<div>Photo</div>`
          , `<div>Style</div>`
          , `<div>Date</div>`
          , `<div>Status</div>`
          , `<div>Result</div>`
          , `<div>Job ID</div>`
          , `<div>Standard Link</div>`
          , `<div>Upscale Link</div>`
          , `</div>`
          , ...data.data.map(job => {
            // Use status directly from DB and show completed_at for Date
            const displayStatus = job.status;
            const statusColor = getStatusColor(displayStatus);
            const statusText = displayStatus;
            const dateText = job.completed_at ? new Date(job.completed_at).toLocaleDateString() : '—';
            const photoUrl = job.has_photo ? `/api/jobs/${job.id}/photo` : '';
            const resultImgSrc = job.has_result ? `/api/jobs/${job.id}/result` : '';
            const viewHref = job.has_result ? (job.view_url || job.result_url || `/api/jobs/${job.id}/result`) : '';
            const upscaledHref = (job.composite_upscaled_url || '').trim();
            const fullJobId = String(job.id || '');
            const shortJobId = fullJobId.slice(0, 8);
            const stylePreviewSrc = `/api/styles/${job.style_id}/preview`;
            return [
              `<div class="order-row">`
              , `<div>${photoUrl ? `<img src="${photoUrl}" alt="Pet photo" />` : `<span class=\"muted\">No photo</span>`}</div>`
              , `<div><img src="${stylePreviewSrc}" alt="${job.style_title}" /></div>`
              , `<div>${dateText}</div>`
              , `<div class="status" style="color:${statusColor}">${statusText}</div>`
              , `<div>${resultImgSrc ? `<img src="${resultImgSrc}" alt="Finished portrait" />` : `<span class=\"muted\">—</span>`}</div>`
              , `<div><a href="#" class="job-id" data-job-id="${fullJobId}" style="font-family:monospace;">${shortJobId}</a></div>`
              , `<div>${viewHref ? `<a href="${viewHref}" class="btn" target="_blank" rel="noopener">View</a>` : `<span class=\"muted\">Not ready</span>`}</div>`
              , `<div>${upscaledHref ? `<a href="${upscaledHref}" class="btn" target="_blank" rel="noopener">Upscale</a>` : `<span class=\"muted\">NA</span>`}</div>`
              , `</div>`
            ].join('');
          })
        ].join('');

        // Hook job ID click to show modal with full ID and copy button
        document.querySelectorAll('.job-id').forEach(a => {
          a.addEventListener('click', (e) => {
            e.preventDefault();
            const id = a.getAttribute('data-job-id') || '';
            showJobIdModal(id);
          });
        });
      } else {
        orderList.innerHTML = `
          <div style="text-align:center; padding:40px;">
            <p class="muted">No portraits yet. Ready to create your first masterpiece?</p>
            <a href="/styles" class="btn primary" data-route>Browse Styles</a>
          </div>
        `;
      }
    } catch (err) {
      console.error('Dashboard load error:', err);
      orderList.innerHTML = `
        <div style="text-align:center; padding:40px;">
          <p class="muted">Unable to load your portraits. Please try again.</p>
          <button class="btn" onclick="location.reload()">Refresh</button>
        </div>
      `;
    }
  }
};

// Simple modal for showing and copying Job ID
function showJobIdModal(id) {
  // Remove any existing modal
  const existing = document.getElementById('jobIdModal');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'jobIdModal';
  overlay.style.position = 'fixed';
  overlay.style.inset = '0';
  overlay.style.background = 'rgba(0,0,0,0.4)';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';

  overlay.innerHTML = `
    <div style="background:#fff;padding:16px;border-radius:12px;max-width:480px;width:92%;box-shadow:0 8px 24px rgba(17,24,39,0.25);">
      <h3 style="margin:0 0 8px 0;">Job ID</h3>
      <input id="jobIdInput" type="text" value="${id}" readonly style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:8px;font-family:monospace;" />
      <div class="hero-actions" style="margin-top:12px; display:flex; gap:8px; justify-content:flex-end;">
        <button id="copyJobIdBtn" class="btn primary" type="button">Copy</button>
        <button id="closeJobIdBtn" class="btn" type="button">Close</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const input = overlay.querySelector('#jobIdInput');
  const copyBtn = overlay.querySelector('#copyJobIdBtn');
  const closeBtn = overlay.querySelector('#closeJobIdBtn');

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(id);
      copyBtn.textContent = 'Copied';
      setTimeout(() => { copyBtn.textContent = 'Copy'; }, 1200);
    } catch (_) {
      // Fallback: select and copy
      input.focus();
      input.select();
      document.execCommand('copy');
      copyBtn.textContent = 'Copied';
      setTimeout(() => { copyBtn.textContent = 'Copy'; }, 1200);
    }
  });

  const close = () => { overlay.remove(); };
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
}

// Modal for upload errors with reason and page reset
function showUploadErrorModal(reason) {
  // Remove any existing modal
  const existing = document.getElementById('uploadErrorModal');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'uploadErrorModal';
  overlay.style.position = 'fixed';
  overlay.style.inset = '0';
  overlay.style.background = 'rgba(0,0,0,0.4)';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';

  overlay.innerHTML = `
    <div style="background:#fff;padding:16px;border-radius:12px;max-width:520px;width:92%;box-shadow:0 8px 24px rgba(17,24,39,0.25);">
      <h3 style="margin:0 0 8px 0;">Upload Failed</h3>
      <p style="margin:0 0 8px 0;">${reason}</p>
      <p class="muted" style="margin:0 0 12px 0;">Files must be <strong>JPG, JPEG, or PNG</strong> and under <strong>5MB</strong>.</p>
      <div class="hero-actions" style="margin-top:12px; display:flex; gap:8px; justify-content:flex-end;">
        <button id="uploadErrorOkBtn" class="btn primary" type="button">OK</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const okBtn = overlay.querySelector('#uploadErrorOkBtn');

  const resetPage = () => {
    try {
      // Clear local UI state
      const input = document.getElementById('fileInput');
      const preview = document.getElementById('preview');
      if (input) input.value = '';
      if (preview) preview.style.display = 'none';
      sessionStorage.removeItem('petPreviewUrl');
      // Navigate back to upload and re-render
      history.pushState({}, '', '/upload');
      render();
    } catch (_) {
      // Fallback to reload
      location.reload();
    }
  };

  const close = () => { overlay.remove(); resetPage(); };
  okBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
}

function getStatusColor(status) {
  switch (status) {
    case 'created': return '#f59e0b';
    case 'in_progress': return '#3b82f6';
    case 'completed': return '#16a34a';
    case 'delivered': return '#16a34a';
    default: return '#6b7280';
  }
}

function getStatusText(status) {
  switch (status) {
    case 'created': return 'Processing';
    case 'in_progress': return 'In Progress';
    case 'completed': return 'Completed';
    case 'delivered': return 'Delivered';
    default: return status;
  }
};

function setActiveLink(pathname) {
  const links = document.querySelectorAll(".nav a[data-route]");
  links.forEach(a => {
    const href = a.getAttribute("href");
    if (href === pathname) a.classList.add("active"); else a.classList.remove("active");
  });
}

async function updateAuthNav() {
  const authNav = document.getElementById("authNav");
  const sessionStatus = document.getElementById("sessionStatus");
  if (!authNav) return;
  
  try {
    const response = await fetch('/api/auth/me', { credentials: 'include' });
    const data = await response.json();
    
    if (data.logged_in && data.user) {
      // Check if the logged-in user is an admin
      let isAdmin = false;
      try {
        const adminRes = await fetch(`${window.API_BASE_URL}/api/admin/me`, { credentials: 'include' });
        const adminInfo = await adminRes.json();
        isAdmin = !!(adminInfo && adminInfo.logged_in && adminInfo.is_admin);
      } catch (_) { /* ignore */ }

      const userName = data.user.name || data.user.email.split('@')[0];
      // For admins, show Admin link instead of Dashboard
      const mainLink = isAdmin
        ? '<a href="/admin/users" data-route style="margin-right: 8px;">Admin</a>'
        : '<a href="/dashboard" data-route style="margin-right: 8px;">Dashboard</a>';
      authNav.innerHTML = `
        <span style="color: #16a34a; margin-right: 8px;">Hi, ${userName}!</span>
        ${mainLink}
        <a href="#" id="signOutBtn">Sign out</a>
      `;
      
      if (sessionStatus) {
        sessionStatus.style.display = 'block';
        sessionStatus.textContent = `Logged in: ${data.user.email}`;
      }
      
      // Add sign out handler
      const signOutBtn = document.getElementById('signOutBtn');
      if (signOutBtn) {
        signOutBtn.addEventListener('click', async (e) => {
          e.preventDefault();
          try {
            // Call backend to clear HttpOnly cookie
            const res = await fetch('/api/auth/signout', { method: 'POST' });
            // Hide session status and redirect
            if (sessionStatus) sessionStatus.style.display = 'none';
            history.pushState({}, '', '/');
            render();
          } catch (err) {
            console.error('Sign out error:', err);
          }
        });
      }
    } else {
      authNav.innerHTML = '<a href="/signin" data-route>Sign in</a>';
      if (sessionStatus) sessionStatus.style.display = 'none';
    }
  } catch (err) {
    // If auth check fails, show sign in
    authNav.innerHTML = '<a href="/signin" data-route>Sign in</a>';
    if (sessionStatus) sessionStatus.style.display = 'none';
  }
}

function render() {
  const app = document.getElementById("app");
  const { pathname } = window.location;
  const view = routes[pathname] || (() => `<section class='container'><h1>Not Found</h1><p class='muted'>That page doesn't exist.</p></section>`);
  app.innerHTML = view();
  setActiveLink(pathname);
  updateAuthNav(); // Update auth status in navigation
  if (afterRender[pathname]) afterRender[pathname]();
}

function onLinkClick(e) {
  const a = e.target.closest("a[data-route]");
  if (!a) return;
  const href = a.getAttribute("href");
  if (href.startsWith("/")) {
    e.preventDefault();
    history.pushState({}, "", href);
    render();
  }
}

window.addEventListener("popstate", render);
window.addEventListener("click", onLinkClick);

// Front-end env default
if (!window.API_BASE_URL) {
  window.API_BASE_URL = "https://www.regalpetportraits.com";
}

render();