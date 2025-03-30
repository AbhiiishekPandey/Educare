import supabase from './supabase.js';

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const showSignupLink = document.getElementById('show-signup');
    const showLoginLink = document.getElementById('show-login');
    const loginContainer = document.querySelector('.col-md-6:not(#signup-container)');
    const signupContainer = document.getElementById('signup-container');
    const authMessage = document.getElementById('auth-message');
    const googleLoginBtn = document.getElementById('google-login');
    const githubLoginBtn = document.getElementById('github-login');
    const forgotPasswordLink = document.getElementById('forgot-password');

    // Check if user is already logged in
    checkUser();

    // Check URL hash for signup
    if (window.location.hash === '#signup') {
        if (loginContainer && signupContainer) {
            loginContainer.classList.add('d-none');
            signupContainer.classList.remove('d-none');
        }
    }

    // Event Listeners
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    if (showSignupLink) {
        showSignupLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginContainer.classList.add('d-none');
            signupContainer.classList.remove('d-none');
        });
    }
    
    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            signupContainer.classList.add('d-none');
            loginContainer.classList.remove('d-none');
        });
    }
    
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', () => handleSocialLogin('google'));
    }
    
    if (githubLoginBtn) {
        githubLoginBtn.addEventListener('click', () => handleSocialLogin('github'));
    }
    
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', handleForgotPassword);
    }

    // Functions
    async function checkUser() {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            
            if (session) {
                // User is already logged in, redirect to home
                window.location.href = 'index.html';
            }
        } catch (error) {
            console.error('Error checking auth status:', error.message);
        }
    }

    async function handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            showMessage('Logging in...', 'info');
            
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            
            if (error) throw error;
            
            showMessage('Login successful! Redirecting...', 'success');
            
            // Store user session if remember me is checked
            if (document.getElementById('rememberMe').checked) {
                localStorage.setItem('educare_session', JSON.stringify(data.session));
            }
            
            // Redirect to dashboard or home page
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
            
        } catch (error) {
            showMessage(`Error: ${error.message}`, 'danger');
        }
    }
    
    async function handleSignup(e) {
        e.preventDefault();
        
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // Validate passwords match
        if (password !== confirmPassword) {
            showMessage('Passwords do not match', 'danger');
            return;
        }
        
        try {
            showMessage('Creating your account...', 'info');
            
            // Sign up the user
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name
                    }
                }
            });
            
            if (error) throw error;
            
            showMessage('Account created successfully! Please check your email to confirm your registration.', 'success');
            
            // Switch back to login form
            setTimeout(() => {
                signupContainer.classList.add('d-none');
                loginContainer.classList.remove('d-none');
            }, 3000);
            
        } catch (error) {
            showMessage(`Error: ${error.message}`, 'danger');
        }
    }
    
    async function handleSocialLogin(provider) {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: provider,
                options: {
                    redirectTo: `${window.location.origin}/index.html`
                }
            });
            
            if (error) throw error;
            
        } catch (error) {
            showMessage(`Error with ${provider} login: ${error.message}`, 'danger');
        }
    }
    
    async function handleForgotPassword(e) {
        e.preventDefault();
        
        const email = prompt('Please enter your email address:');
        
        if (!email) return;
        
        try {
            showMessage('Processing your request...', 'info');
            
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password.html`
            });
            
            if (error) throw error;
            
            showMessage('Password reset email sent. Please check your inbox.', 'success');
            
        } catch (error) {
            showMessage(`Error: ${error.message}`, 'danger');
        }
    }
    
    function showMessage(message, type) {
        if (!authMessage) return;
        
        authMessage.textContent = message;
        authMessage.className = `alert alert-${type}`;
        authMessage.classList.remove('d-none');
        
        // Hide message after 5 seconds
        setTimeout(() => {
            authMessage.classList.add('d-none');
        }, 5000);
    }
});