# Goal Description

Implement Google Login & Sign-up, and Email/Password Login & Sign-up on the user website. For Email Sign-up, integrate an SMTP-based flow that generates and sends a 6-digit verification OTP to the user's email before creating the account in the database (Supabase or Mock fallback).

---

## User Review Required

> [!IMPORTANT]
> **SMTP Credentials**
> - The SMTP configuration details will be loaded from the root `.env` file.
> - We will use placeholders in the environment files and guide you on how to fill them.
> - The actual emails will be sent using the email address and app password you configure yourself (following the steps in [setup_guide.md](file:///C:/Users/bogag/.gemini/antigravity-ide/brain/af8a34cb-ad32-4e51-871e-13b221e59d4f/setup_guide.md)).

> [!IMPORTANT]
> **Google Client ID**
> - The Google Sign-In flow requires a Google Client ID. We will configure a placeholder in `.env` (`VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com`).
> - For local development or if the Client ID is not yet configured, the app will support developer testing with informative fallbacks.
> - The user will need to configure their Google Cloud Console to set up an OAuth 2.0 Client ID, add `http://localhost:5173` as an Authorized JavaScript Origin, and update `VITE_GOOGLE_CLIENT_ID` in `.env`.

---

## Proposed Changes

### 1. Environment & Dependencies

#### [MODIFY] [package.json](file:///c:/COMPANY%2520PROJECTS/NVKM%2520ecommerce/package.json)
- Add `nodemailer` and `google-auth-library` to dependencies.

#### [MODIFY] [.env](file:///c:/COMPANY%2520PROJECTS/NVKM%2520ecommerce/.env)
- Add SMTP environment variables:
  ```env
  SMTP_HOST=smtp.gmail.com
  SMTP_PORT=587
  SMTP_USER=your-email@gmail.com
  SMTP_PASSWORD=your-16-character-app-password
  SMTP_FROM="Your App Name <your-email@gmail.com>"
  ```
- Add Google Client ID environment variable:
  ```env
  VITE_GOOGLE_CLIENT_ID=732049071536-fakeclientid.apps.googleusercontent.com
  ```

#### [MODIFY] [vite.config.js](file:///c:/COMPANY%2520PROJECTS/NVKM%2520ecommerce/client/vite.config.js)
- Add `envDir: '../'` to Vite config so the frontend can read variables from the root `.env` file (like `VITE_GOOGLE_CLIENT_ID`).

---

### 2. Backend Server

#### [NEW] [mailer.js](file:///c:/COMPANY%2520PROJECTS/NVKM%2520ecommerce/server/utils/mailer.js)
- Create a reusable SMTP email utility using `nodemailer`.
- Expose `sendOtpEmail(email, otp)` using a clean, brand-matching HTML email template.

#### [MODIFY] [auth.js](file:///c:/COMPANY%2520PROJECTS/NVKM%2520ecommerce/server/routes/auth.js)
- Implement an in-memory `otpCache` Map to temporarily store registration credentials (`{ name, phone, email, password, otp, expiresAt }`).
- **`POST /api/auth/register-otp`**:
  - Validate registration inputs (name, phone, email, password).
  - Verify email is not already registered in Supabase or Mock DB.
  - Generate a random 6-digit OTP code.
  - Call `sendOtpEmail` to deliver the OTP.
  - Cache the user details and OTP with a 10-minute expiry.
- **`POST /api/auth/register-verify`**:
  - Verify the 6-digit OTP and check expiry.
  - Retrieve user details from cache.
  - Hash the password using bcrypt.
  - Insert user to Supabase (or Mock DB fallback) as role `'user'`.
  - Delete user details from cache.
  - Return user object and JWT token.
- **`POST /api/auth/google`**:
  - Receive the Google client-side `credential` token.
  - Use `google-auth-library` to verify the ID token.
  - Retrieve verified email, name, and googleId.
  - Look up user in Supabase (or Mock DB fallback).
  - If not found, create user with placeholder password and default role `'user'`.
  - Return user object and JWT token.

---

### 3. Frontend Client

#### [MODIFY] [index.html](file:///c:/COMPANY%2520PROJECTS/NVKM%2520ecommerce/client/index.html)
- Load Google Identity Services client script:
  `<script src="https://accounts.google.com/gsi/client" async defer></script>` in the `<head>`.

#### [MODIFY] [AuthContext.jsx](file:///c:/COMPANY%2520PROJECTS/NVKM%2520ecommerce/client/src/context/AuthContext.jsx)
- Add `requestRegisterOtp(name, phone, email, password)` calling `/auth/register-otp`.
- Add `verifyRegisterOtp(email, otp)` calling `/auth/register-verify`.
- Update `loginWithGoogle(credential)` to post `{ credential }` instead of raw mock fields to `/auth/google`.

#### [MODIFY] [Login.jsx](file:///c:/COMPANY%2520PROJECTS/NVKM%2520ecommerce/client/src/pages/Login.jsx)
- **Google Login**:
  - Use `useEffect` to initialize `window.google.accounts.id` and render the official Google button into container `#google-signin-btn` (on both Sign In and Register tabs).
  - Pass the token returned from the Google callback directly to `loginWithGoogle`.
- **OTP Sign Up**:
  - When submitting registration, call `requestRegisterOtp` instead of directly creating the account.
  - If successful, set `regOtpSent` to true and display the 6-digit OTP boxes.
  - Once user enters the OTP, call `verifyRegisterOtp` to complete registration and log in.
  - Provide a "Back" button to return to the registration form if they need to edit details.

---

## Verification Plan

### Automated Tests
- Run `npm install` to update backend dependencies.
- Verify backend server and frontend client run without errors:
  `npm run dev`
- Monitor node server logs for proper initializations.

### Manual Verification
- **Google Login**:
  - Click the Google Button, log in, and check if account is successfully created/retrieved and navigated to the dashboard.
- **Email/Password Sign-up with OTP**:
  - Fill out the register form and click "Create Account".
  - Verify SMTP email is received containing the 6-digit OTP code.
  - Verify that invalid/expired OTP shows an error.
  - Enter the correct OTP and verify that registration is finalized and the user is logged in automatically.
