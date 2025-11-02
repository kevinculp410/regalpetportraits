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
          <div class="body">Choose a style, upload a clear photo, and complete checkout. You’ll receive a proof within 24 hours.</div>
        </details>
        <details class="card">
          <summary class="title" style="padding:12px;">Which pets are supported?</summary>
          <div class="body">Dogs, cats, and most household pets. If you’re unsure, contact us and we’ll confirm.</div>
        </details>
        <details class="card">
          <summary class="title" style="padding:12px;">How long does it take?</summary>
          <div class="body">Proofs are usually ready within 24 hours. Printing and shipping typically take 2–5 days after approval.</div>
        </details>
        <details class="card">
          <summary class="title" style="padding:12px;">Can I request revisions?</summary>
          <div class="body">Yes—unlimited revisions until you’re 100% happy with the artwork.</div>
        </details>
        <details class="card">
          <summary class="title" style="padding:12px;">Do you offer gifts?</summary>
          <div class="body">Absolutely. You can order for a recipient or purchase a gift card.</div>
        </details>
      </div>
    </section>

    <footer style="background-color:#8b5cf6;color:#fff;padding:16px 0;margin-top:16px;">
      <div class="container" style="display:flex;justify-content:space-between;align-items:center;gap:12px;font-size:12px;">
        <div>CopyRight 2025 @<a href="https://www.BlueSkyAiAutomation.com" style="color:#fff;text-decoration:underline;">BlueSkyAiAutomation</a></div>
        <div style="display:flex;gap:12px;">
          <a href="/privacy" data-route style="color:#fff;text-decoration:underline;">Privacy Policy</a>
          <a href="/terms" data-route style="color:#fff;text-decoration:underline;">Terms and Service</a>
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
  const stylePreviewUrl = `${window.API_BASE_URL}/api/styles/${styleId}/preview`;
  
  // Store in sessionStorage for later use
  if (styleId) sessionStorage.setItem('styleId', styleId);
  if (styleTitle) sessionStorage.setItem('styleTitle', styleTitle);
  if (styleId) sessionStorage.setItem('stylePreviewUrl', stylePreviewUrl);
  
  return `
    <section class="container">
      <h1>Upload Your Pet's Photo</h1>
      <div class="style-preview">
        <img src="${stylePreviewUrl}" alt="Selected style preview" />
        <div class="pill">Selected style: ${styleTitle}</div>
      </div>
      <p>Use a well-lit photo with your pet facing forward. Avoid blurry or dark images.</p>

      <div class="upload-zone">
        <input id="fileInput" type="file" accept="image/*" />
        <p class="muted">Drag & drop or choose a file</p>
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
        <h1>Your Portraits</h1>
        <a href="/styles" class="btn primary" data-route id="placeOrderBtn">Place Order</a>
      </div>
      <div id="dashboardStatus" class="pill" style="display:none; margin:8px 0;"></div>
      <h2 style="margin-top:16px;">Previous Jobs</h2>
      <div id="orderList" class="order-list">
        <div class="loading" style="text-align:center; padding:40px; color:#6b7280;">
          Loading your portraits...
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
    { q: "How do I order?", a: "Choose a style, upload a clear photo, and complete checkout. You’ll receive a proof within 24 hours." },
    { q: "Which pets are supported?", a: "Dogs, cats, and most household pets. If you’re unsure, contact us and we’ll confirm." },
    { q: "How long does it take?", a: "Proofs are usually ready within 24 hours. Printing and shipping typically take 2–5 days after approval." },
    { q: "Can I request revisions?", a: "Yes—unlimited revisions until you’re 100% happy with the artwork." },
    { q: "Do you offer gifts?", a: "Absolutely. You can order for a recipient or purchase a gift card." },
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
    <section class="container">
      <h1>Admin</h1>
      <p>Login with admin credentials to manage styles and users.</p>

      <form id="adminLoginForm" class="form" style="max-width:400px; margin:16px 0;">
        <input id="adminLoginEmail" type="email" placeholder="Admin email" required style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;" />
        <input id="adminLoginPassword" type="password" placeholder="Password" required style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;" />
        <div class="hero-actions"><button class="btn" type="submit">Login</button></div>
        <div id="adminLoginStatus" class="pill" style="margin-top:10px; display:none;"></div>
      </form>

      <div id="adminContent" style="display:none;">
        <div class="subnav" style="margin-bottom:16px; display:flex; gap:8px;">
          <a href="/admin" data-route class="btn primary">Styles</a>
          <a href="/admin/users" data-route class="btn">Users</a>
        </div>

        <h1>Upload Styles</h1>
        <form id="adminUploadForm" class="form" style="max-width:500px; margin:20px 0;">
          <input id="styleTitle" type="text" placeholder="Style title (e.g., Royal Regency)" required style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;" />
          <textarea id="styleDescription" placeholder="Style description (optional)" rows="3" style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;"></textarea>
          <div class="upload-zone" style="margin:16px 0;">
            <input id="styleImageInput" type="file" accept="image/*" required />
            <p class="muted">Choose a style preview image</p>
          </div>
          <div id="stylePreview" class="preview" style="display:none; margin:16px 0;">
            <img id="stylePreviewImg" src="" alt="Preview" style="max-width:200px;border-radius:8px;border:1px solid #e5e7eb;" />
          </div>
          <div class="hero-actions">
            <button id="adminUploadBtn" class="btn primary" type="submit">Upload Style</button>
            <button id="adminDeleteAllBtn" class="btn" type="button">Delete All Styles</button>
          </div>
          <div id="adminStatus" class="pill" style="margin-top:10px; display:none;"></div>
        </form>

        <h2>Current Styles</h2>
        <div id="adminStylesList" class="grid"></div>
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
        </div>

        <div id="adminUsersStatus" class="pill" style="margin-top:10px; display:none;"></div>
        <div id="adminUsersList" class="grid"></div>
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

const routes = {
  "/": HomePage,
  "/signin": SignInPage,
  "/reset-password": ResetPasswordPage,
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
  "/admin/users": AdminUsersPage,
  "/verify-email": VerifyEmailPage,
};

const afterRender = {
  "/styles": async () => {
    const grid = document.getElementById('gridStyles');
    if (!grid) return;
    
    try {
      const response = await fetch(`${window.API_BASE_URL}/api/styles`);
      const data = await response.json();
      
      if (data.data && data.data.length > 0) {
        grid.innerHTML = data.data.map(item => `
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

          // 3) Upload to S3 via presigned URL
          status.textContent = 'Uploading photo...';
          const putRes = await fetch(presign.url, { method: 'PUT', headers: { 'Content-Type': file.type || 'application/octet-stream' }, body: file });
          if (!putRes.ok) {
            status.style.backgroundColor = '#fee2e2';
            status.style.color = '#dc2626';
            status.textContent = 'Upload failed (S3). Please try a different photo or contact support.';
            return;
          }

          // Save S3 key for checkout
          sessionStorage.setItem('petS3Key', presign.s3_key);
          // Build and store pet_file for checkout
          if (presign.s3_key) {
            const parts = presign.s3_key.split('/');
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
              body: JSON.stringify({ s3_key: presign.s3_key })
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
        const res = await fetch('/api/auth/signin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Sign in failed');
        }
        status.textContent = 'Welcome back! Redirecting…';
        const dest = sessionStorage.getItem('postLoginRedirect') || '/dashboard';
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
        status.textContent = 'Account created! Please check your email to verify your account.';
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
    const loginForm = document.getElementById('adminLoginForm');
    const loginStatus = document.getElementById('adminLoginStatus');
    const adminContent = document.getElementById('adminContent');
    const uploadForm = document.getElementById('adminUploadForm');
    const status = document.getElementById('adminStatus');
    const imageInput = document.getElementById('styleImageInput');
    const preview = document.getElementById('stylePreview');
    const previewImg = document.getElementById('stylePreviewImg');
    const stylesList = document.getElementById('adminStylesList');

    // Check admin status
    try {
      const meRes = await fetch(`${window.API_BASE_URL}/api/admin/me`);
      const me = await meRes.json();
      if (me.logged_in && me.is_admin) {
        adminContent.style.display = 'block';
        loginForm.style.display = 'none';
      } else {
        adminContent.style.display = 'none';
        loginForm.style.display = 'block';
      }
    } catch (e) {
      adminContent.style.display = 'none';
      loginForm.style.display = 'block';
    }

    // Admin login
    if (loginForm) loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      loginStatus.style.display = 'inline-block';
      loginStatus.textContent = 'Logging in...';
      try {
        const payload = {
          email: document.getElementById('adminLoginEmail').value,
          password: document.getElementById('adminLoginPassword').value
        };
        const res = await fetch(`${window.API_BASE_URL}/api/auth/admin/login`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        });
        const out = await res.json();
        if (!res.ok) throw new Error(out.error || 'Login failed');
        loginStatus.textContent = 'Logged in.';
        setTimeout(() => { history.pushState({}, '', '/admin'); render(); }, 600);
      } catch (err) {
        loginStatus.textContent = `Login failed: ${err.message}`;
      }
    });

    // Preview selected image
    if (imageInput) imageInput.addEventListener('change', () => {
      const file = imageInput.files && imageInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        previewImg.src = reader.result;
        preview.style.display = 'block';
      };
      reader.readAsDataURL(file);
    });

    // Upload style
    const uploadBtn = document.getElementById('adminUploadBtn');
    if (uploadBtn) uploadBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      status.style.display = 'inline-block';
      status.textContent = 'Uploading style...';
      try {
        const title = document.getElementById('styleTitle').value;
        const description = document.getElementById('styleDescription').value;
        const fileInput = document.getElementById('styleImageInput');
        const file = fileInput.files && fileInput.files[0];
        if (!file) throw new Error('No file selected');
        const reader = new FileReader();
        reader.onload = async () => {
          const imageData = reader.result;
          const payload = { title, description, imageData, fileName: file.name };
          const res = await fetch(`${window.API_BASE_URL}/api/styles`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
          });
          const out = await res.json();
          if (!res.ok) throw new Error(out.error || 'Upload failed');
          status.textContent = 'Style uploaded.';
          setTimeout(() => { history.pushState({}, '', '/admin'); render(); }, 800);
        };
        reader.readAsDataURL(file);
      } catch (err) {
        status.textContent = `Upload failed: ${err.message}`;
      }
    });

    // Delete ALL styles
    const delAll = document.getElementById('adminDeleteAllBtn');
    if (delAll) delAll.addEventListener('click', async () => {
      if (!confirm('Delete ALL styles from database and S3?')) return;
      status.style.display = 'inline-block';
      status.textContent = 'Deleting all styles...';
      try {
        const res = await fetch(`${window.API_BASE_URL}/api/styles/delete-all`, { method: 'POST' });
        const out = await res.json();
        if (!res.ok || !out.success) throw new Error(out.error || 'Delete all failed');
        status.textContent = `Deleted ${out.deleted_rows} styles.`;
        setTimeout(() => { history.pushState({}, '', '/admin'); render(); }, 800);
      } catch (err) {
        status.textContent = `Delete all failed: ${err.message}`;
      }
    });

    // Load current styles (smaller previews)
    try {
      const response = await fetch(`${window.API_BASE_URL}/api/styles`);
      const data = await response.json();
      if (data.data && stylesList) {
        stylesList.innerHTML = data.data.map(item => `
          <div class="card" style="display:flex; gap:12px; align-items:flex-start;">
            <img src="${window.API_BASE_URL}/api/styles/${item.id}/preview" alt="${item.title}" style="max-width:200px;border-radius:8px;border:1px solid #e5e7eb;" />
            <div class="body">
              <div class="title">${item.title}</div>
              <div class="muted">${item.description || ''}</div>
              <div class="actions">
                <button class="btn" data-delete data-style-id="${item.id}">Delete</button>
              </div>
            </div>
          </div>
        `).join('');
      }
    } catch (_) {}

    // Hook per-style delete buttons
    document.querySelectorAll('[data-delete][data-style-id]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const styleId = btn.getAttribute('data-style-id');
        if (!styleId) return;
        if (!confirm('Delete this style from database and S3?')) return;
        status.style.display = 'inline-block';
        status.textContent = 'Deleting style...';
        try {
          const res = await fetch(`${window.API_BASE_URL}/api/styles/${styleId}`, { method: 'DELETE' });
          const payload = await res.json();
          if (!res.ok || !payload.success) throw new Error(payload.error || 'Delete failed');
          status.textContent = 'Style deleted.';
          setTimeout(() => { history.pushState({}, '', '/admin'); render(); }, 800);
        } catch (err) {
          status.textContent = `Delete failed: ${err.message}`;
        }
      });
    });
  },
  "/admin/styles": async () => { if (afterRender["/admin"]) await afterRender["/admin"](); },
  "/admin/users": async () => {
    const loginForm = document.getElementById('adminLoginForm');
    const loginStatus = document.getElementById('adminLoginStatus');
    const adminContent = document.getElementById('adminContent');
    const status = document.getElementById('adminUsersStatus');
    const list = document.getElementById('adminUsersList');
    if (!list) return;
    try {
      const meRes = await fetch(`${window.API_BASE_URL}/api/admin/me`);
      const me = await meRes.json();
      if (!me.logged_in || !me.is_admin) {
        adminContent.style.display = 'none';
        loginForm.style.display = 'block';
        status.style.display = 'inline-block';
        status.textContent = 'Admin login required to view users.';
        return;
      } else {
        adminContent.style.display = 'block';
        loginForm.style.display = 'none';
      }
    } catch (_) {
      adminContent.style.display = 'none';
      loginForm.style.display = 'block';
      status.style.display = 'inline-block';
      status.textContent = 'Could not verify admin session.';
      return;
    }

    // Admin login (Users page)
    if (loginForm) loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      loginStatus.style.display = 'inline-block';
      loginStatus.textContent = 'Logging in...';
      try {
        const payload = {
          email: document.getElementById('adminLoginEmail').value,
          password: document.getElementById('adminLoginPassword').value
        };
        const res = await fetch(`${window.API_BASE_URL}/api/auth/admin/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const out = await res.json();
        if (!res.ok) throw new Error(out.error || 'Login failed');
        loginStatus.textContent = 'Logged in.';
        setTimeout(() => { history.pushState({}, '', '/admin/users'); render(); }, 600);
      } catch (err) {
        loginStatus.textContent = `Login failed: ${err.message}`;
      }
    });

    status.style.display = 'inline-block';
    status.textContent = 'Loading users...';
    try {
      const res = await fetch(`${window.API_BASE_URL}/api/admin/users`);
      const out = await res.json();
      if (!res.ok) throw new Error(out.error || 'Failed to load users');
      const data = out.data || [];
      status.style.display = 'none';
      list.innerHTML = data.map(u => {
        const jobs = (u.jobs || []).map(j => `
          <div class="order" style="display:flex; gap:12px; align-items:center;">
            <div style="flex:1;">
              <div class="title">Job ${j.id}</div>
              <div class="muted">Style: ${j.style_id} · Status: ${j.status}</div>
              <div class="muted">${j.prompt_text || ''}</div>
            </div>
            <div class="actions"><button class="btn" data-delete-job data-job-id="${j.id}">Delete Job</button></div>
          </div>
        `).join('');
        return `
          <div class="card">
            <div class="body">
              <div class="title">${u.email}${u.name ? ` · ${u.name}` : ''}</div>
              <div class="muted">Joined ${new Date(u.created_at).toLocaleString()}</div>
              <div style="margin-top:8px;">
                ${jobs || '<div class="muted">No jobs.</div>'}
              </div>
            </div>
          </div>
        `;
      }).join('');

      // Hook job delete buttons
      document.querySelectorAll('[data-delete-job][data-job-id]').forEach(btn => {
        btn.addEventListener('click', async () => {
          const jobId = btn.getAttribute('data-job-id');
          if (!jobId) return;
          if (!confirm('Delete this job?')) return;
          status.style.display = 'inline-block';
          status.textContent = 'Deleting job...';
          try {
            const del = await fetch(`${window.API_BASE_URL}/api/admin/jobs/${jobId}`, { method: 'DELETE' });
            const out = await del.json();
            if (!del.ok || !out.success) throw new Error(out.error || 'Delete failed');
            status.textContent = 'Job deleted.';
            setTimeout(() => { history.pushState({}, '', '/admin/users'); render(); }, 600);
          } catch (err) {
            status.textContent = `Delete failed: ${err.message}`;
          }
        });
      });
    } catch (err) {
      status.textContent = `Load failed: ${err.message}`;
    }
  },
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
    const orderList = document.getElementById('orderList');
    const status = document.getElementById('dashboardStatus');
    
    if (!orderList) return;
    
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
        return;
      }
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
            const resultUrl = job.has_result ? `/api/jobs/${job.id}/result` : '';
            const viewHref = job.has_result ? (job.view_url || job.result_url || resultUrl) : '';
            const upscaledHref = (job.composite_upscaled_url || '').trim();
            const fullJobId = String(job.id || '');
            const shortJobId = fullJobId.slice(0, 8);
            return [
              `<div class="order-row">`
              , `<div>${photoUrl ? `<img src="${photoUrl}" alt="Pet photo" />` : `<span class=\"muted\">No photo</span>`}</div>`
              , `<div><img src="/api/styles/${job.style_id}/preview" alt="${job.style_title}" /></div>`
              , `<div>${dateText}</div>`
              , `<div class="status" style="color:${statusColor}">${statusText}</div>`
              , `<div>${resultUrl ? `<img src="${resultUrl}" alt="Finished portrait" />` : `<span class=\"muted\">—</span>`}</div>`
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
    const response = await fetch('/api/auth/me');
    const data = await response.json();
    
    if (data.logged_in && data.user) {
      const userName = data.user.name || data.user.email.split('@')[0];
      authNav.innerHTML = `
        <span style="color: #16a34a; margin-right: 8px;">Hi, ${userName}!</span>
        <a href="/dashboard" data-route style="margin-right: 8px;">Dashboard</a>
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