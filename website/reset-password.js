import supabase from './supabase.js';

document.addEventListener('DOMContentLoaded', () => {
    const resetForm = document.getElementById('reset-form');
    const resetMessage = document.getElementById('reset-message');

    // Get the hash from the URL
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const type = params.get('type');

    // Check if we have the required tokens
    if (!accessToken || type !== 'recovery') {
        showMessage('Invalid or expired password reset link. Please request a new one.', 'danger');
        resetForm.style.display = 'none';
        return;
    }

    // Set up the session
    setSession(accessToken, refreshToken);

    // Handle form submission
    resetForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const newPassword = document.getElementById('new-password').value;
        const confirmNewPassword = document.getElementById('confirm-new-password').value;
        
        // Validate passwords match
        if (newPassword !== confirmNewPassword) {
            showMessage('Passwords do not match', 'danger');
            return;
        }
        
        try {
            showMessage('Updating your password...', 'info');
            
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });
            
            if (error) throw error;
            
            showMessage('Password updated successfully! Redirecting to login...', 'success');
            
            // Redirect to login page
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            
        } catch (error) {
            showMessage(`Error: ${error.message}`, 'danger');
        }
    });

    // Helper functions
    async function setSession(accessToken, refreshToken) {
        try {
            const { data, error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken
            });
            
            if (error) throw error;
            
        } catch (error) {
            showMessage(`Error setting session: ${error.message}`, 'danger');
            resetForm.style.display = 'none';
        }
    }

    function showMessage(message, type) {
        resetMessage.textContent = message;
        resetMessage.className = `alert alert-${type}`;
        resetMessage.classList.remove('d-none');
    }
});