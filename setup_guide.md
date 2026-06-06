# Setup Guide: Google OAuth & Gmail SMTP Integration

This guide provides step-by-step instructions on how to set up Google Cloud for Google Sign-In and how to configure a new Gmail SMTP account with App Passwords.

---

## 1. Setting up Google Cloud Console for Google Login

To enable Google Sign-In on the website, you need to generate a **Google Client ID**. Follow these steps:

### Step 1: Create a Google Cloud Project
1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Log in with your Google Workspace or Gmail account.
3. Click the project dropdown in the top-left corner and click **New Project**.
4. Enter a project name (e.g., `NVKM E-Commerce`) and click **Create**.
5. Select your newly created project from the dropdown.

### Step 2: Configure the OAuth Consent Screen
1. In the left navigation menu, go to **APIs & Services > OAuth consent screen**.
2. Select **User Type: External** and click **Create**.
3. Under **App information**:
   - **App name**: `NVKM GROUP` (or your preferred public name)
   - **User support email**: Select your Gmail account.
4. Under **Developer contact information**:
   - **Email addresses**: Enter your email address.
5. Click **Save and Continue**.
6. (Optional) Skip the **Scopes** and **Test users** sections by clicking **Save and Continue** until you return to the dashboard.
7. Click **Publish App** on the OAuth consent screen dashboard to make it live for testing.

### Step 3: Create OAuth 2.0 Credentials (Client ID)
1. In the left navigation menu, click **Credentials**.
2. Click **+ Create Credentials** at the top and select **OAuth client ID**.
3. Set the **Application type** to `Web application`.
4. Name the client (e.g., `NVKM Frontend Client`).
5. Scroll down to **Authorized JavaScript origins**:
   - Click **+ Add URI** and type: `http://localhost:5173` (for local development)
   - Click **+ Add URI** again and type your production website URL (e.g., `https://nvkmgroup.com` if you have one).
6. Under **Authorized redirect URIs**, you can leave it blank (Google Identity Services client-side credential handles this via JavaScript callbacks).
7. Click **Create**.
8. A popup will display your **Client ID** and **Client Secret**. Copy the **Client ID**.
9. Paste it into your `.env` file under:
   ```env
   VITE_GOOGLE_CLIENT_ID=your-copied-client-id-here.apps.googleusercontent.com
   ```

---

## 2. Setting up a Gmail Account for SMTP Email Sending

To send OTP verification emails, we use Gmail SMTP. Because Google block direct password logins for safety, you **must generate an App Password**. Follow these steps:

### Step 1: Enable 2-Step Verification
1. Log in to the Google Account you wish to use for sending emails (e.g., `nvkmfoods@gmail.com`).
2. Go to your [Google Account Settings](https://myaccount.google.com/).
3. In the left menu, click **Security**.
4. Scroll down to "How you sign in to Google" and check if **2-Step Verification** is turned **On**.
5. If it is Off, click on it, click **Get Started**, verify your phone number, and turn it **On**.

### Step 2: Generate an App Password
1. Once 2-Step Verification is active, go back to the **Security** tab.
2. Under "How you sign in to Google", click on **2-Step Verification**.
3. Scroll all the way down to the bottom of the page to find **App passwords**.
4. Click on **App passwords** (if prompted, enter your password again).
5. In the input box, enter a name describing the use case (e.g., `NVKM E-Commerce Server`).
6. Click **Create**.
7. A window will pop up showing a **16-character password** (e.g., `abcd efgh ijkl mnop`) inside a yellow background.
8. Copy this password. **Save it somewhere safe**, because Google will never show it to you again.

### Step 3: Update Environment Variables
Open the `.env` file in your project root and replace the SMTP variables:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-new-email@gmail.com
SMTP_PASSWORD=sixteencharacterapppasswordwithoutspaces
SMTP_FROM="NVKM GROUP <your-new-email@gmail.com>"
```
*(Make sure to remove any spaces in the 16-character app password when pasting it).*
