// OAuth client IDs are public identifiers; never place provider app secrets here.
const OAUTH_CONFIG = {
    googleClientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
    facebookAppId: 'YOUR_FACEBOOK_APP_ID',
    verificationEndpoint: '/api/auth/oauth'
};
let facebookSdkInitialized = false;

function isCoffeeLoverSelected() {
    const activeRole = document.querySelector('.role-option.active')?.dataset.role;
    if (activeRole !== 'individual') {
        showGlobalNotification('Social login is only available for Coffee Lover accounts.', 'error');
        return false;
    }
    return true;
}

function hasOAuthConfiguration(provider) {
    const configured = provider === 'Google'
        ? OAUTH_CONFIG.googleClientId !== 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com'
        : OAUTH_CONFIG.facebookAppId !== 'YOUR_FACEBOOK_APP_ID';

    if (!configured) {
        showGlobalNotification(`${provider} sign-up is not configured yet. Please use email for now.`, 'error');
    }
    return configured;
}

async function completeOAuthSignup(provider, providerToken) {
    // The server must verify this provider token and set the app session in an
    // HttpOnly cookie; only the verified, non-secret profile is kept in storage.
    const response = await fetch(OAUTH_CONFIG.verificationEndpoint, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: provider.toLowerCase(), accessToken: providerToken })
    });

    if (!response.ok) {
        throw new Error(`Account verification failed (${response.status}).`);
    }

    const result = await response.json();
    const user = result.user;
    const expires = Number(result.expires);
    if (!user || !user.email || !user.fullName || !Number.isFinite(expires) || expires <= Date.now()) {
        throw new Error('The authentication server returned an invalid session.');
    }

    sessionStorage.setItem('kahawa_session', JSON.stringify({
        user: {
            email: user.email,
            fullName: user.fullName,
            avatar: user.avatar || null,
            role: 'individual',
            provider
        },
        expires
    }));

    showGlobalNotification(`Welcome, ${user.fullName}! Signed in with ${provider}.`, 'success');
    setTimeout(() => {
        window.location.href = 'user.html';
    }, 1200);
}

function handleGoogleSignup() {
    if (!isCoffeeLoverSelected() || !hasOAuthConfiguration('Google')) return;

    if (!window.google?.accounts?.oauth2) {
        showGlobalNotification('Google Sign-In is still loading. Please try again.', 'error');
        return;
    }

    const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: OAUTH_CONFIG.googleClientId,
        scope: 'openid email profile',
        callback: async tokenResponse => {
            if (tokenResponse.error || !tokenResponse.access_token) {
                showGlobalNotification('Google authentication was cancelled or failed.', 'error');
                return;
            }

            try {
                await completeOAuthSignup('Google', tokenResponse.access_token);
            } catch (error) {
                console.error('Google OAuth error:', error);
                showGlobalNotification(error.message || 'Google sign-up failed. Please try again.', 'error');
            }
        }
    });

    tokenClient.requestAccessToken();
}

function initializeFacebookSdk() {
    if (!window.FB || OAUTH_CONFIG.facebookAppId === 'YOUR_FACEBOOK_APP_ID') return false;
    if (!facebookSdkInitialized) {
        window.FB.init({
            appId: OAUTH_CONFIG.facebookAppId,
            cookie: true,
            xfbml: false,
            version: 'v19.0'
        });
        facebookSdkInitialized = true;
    }
    return true;
}

window.fbAsyncInit = initializeFacebookSdk;

function handleFacebookSignup() {
    if (!isCoffeeLoverSelected() || !hasOAuthConfiguration('Facebook')) return;
    if (!initializeFacebookSdk()) {
        showGlobalNotification('Facebook SDK is still loading. Please try again.', 'error');
        return;
    }

    window.FB.login(response => {
        if (response.status !== 'connected' || !response.authResponse?.accessToken) {
            showGlobalNotification('Facebook authentication was cancelled or failed.', 'error');
            return;
        }

        completeOAuthSignup('Facebook', response.authResponse.accessToken).catch(error => {
            console.error('Facebook OAuth error:', error);
            showGlobalNotification(error.message || 'Facebook sign-up failed. Please try again.', 'error');
        });
    }, { scope: 'public_profile,email' });
}

window.handleGoogleSignup = handleGoogleSignup;
window.handleFacebookSignup = handleFacebookSignup;

document.getElementById('googleSignupBtn')?.addEventListener('click', event => {
    event.preventDefault();
    handleGoogleSignup();
});
document.getElementById('facebookSignupBtn')?.addEventListener('click', event => {
    event.preventDefault();
    handleFacebookSignup();
});

document.documentElement.dataset.oauthReady = 'true';
