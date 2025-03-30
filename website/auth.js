import supabase from './supabase.js';

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in
    checkUser();

    // Functions
    async function checkUser() {
        try {
            const { data: { session }, error } = await supabase.auth.getSession();
            
            if (error) {
                console.error('Error checking auth status:', error.message);
                return;
            }
            
            if (session) {
                // User is logged in
                console.log('User is logged in:', session.user);
                updateUIForLoggedInUser(session.user);
            } else {
                // User is not logged in
                updateUIForLoggedOutUser();
            }
        } catch (err) {
            console.error('Unexpected error checking auth:', err);
        }
    }
    
    function updateUIForLoggedInUser(user) {
        // Update navigation buttons
        const navButtons = document.querySelector('.nav-buttons');
        if (navButtons) {
            const displayName = user.user_metadata?.full_name || user.email;
            navButtons.innerHTML = `
                <span class="text-light me-2">Welcome, ${displayName}</span>
                <button id="logoutBtn" class="btn btn-outline-light">Logout</button>
            `;
            
            // Add logout functionality
            document.getElementById('logoutBtn').addEventListener('click', handleLogout);
        }
    }
    
    function updateUIForLoggedOutUser() {
        // Ensure login buttons are displayed (they should be by default)
        const navButtons = document.querySelector('.nav-buttons');
        if (navButtons && !navButtons.querySelector('a[href="login.html"]')) {
            navButtons.innerHTML = `
                <a href="login.html" class="btn btn-outline-light me-2">Login</a>
                <a href="login.html#signup" class="btn btn-primary">Get Started</a>
            `;
        }
    }
    
    async function handleLogout() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            
            // Redirect to home page or show logged-out state
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Error logging out:', error.message);
            alert('Error logging out: ' + error.message);
        }
    }
});