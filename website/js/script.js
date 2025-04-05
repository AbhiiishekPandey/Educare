document.addEventListener('DOMContentLoaded', function() {
    // Import services that use environment variables
    try {
        // Only attempt to import if running in Node.js environment
        if (typeof require !== 'undefined') {
            const googleServices = require('./google-services');
            const youtubeServices = require('./youtube');
            const aiServices = require('./ai-services');
            
            // Make services available globally
            window.googleServices = googleServices;
            window.youtubeServices = youtubeServices;
            window.aiServices = aiServices;
        }
    } catch (error) {
        console.warn('Running in browser environment, services using API keys will be limited:', error);
    }
    
    // Do Not Disturb Notification
    const dndNotification = document.getElementById('dnd-notification');
    const closeNotificationBtn = document.getElementById('close-notification');
    const disableDndBtn = document.getElementById('disable-dnd');
    const dndCheckbox = document.getElementById('dnd-checkbox');
    
    // Check if DND mode is already set in local storage
    const savedDndMode = localStorage.getItem('dndMode');
    if (dndCheckbox && savedDndMode !== null) {
        dndCheckbox.checked = savedDndMode === 'true';
    }
    
    // Only show the notification if DND is enabled or has never been set
    if (savedDndMode === 'true' || savedDndMode === null) {
        // Show DND notification after page loads with a slight delay
        setTimeout(() => {
            dndNotification.classList.add('show');
        }, 2500); // Show after laptop loader disappears
    }
    
    // Handle close button click
    if (closeNotificationBtn) {
        closeNotificationBtn.addEventListener('click', () => {
            dndNotification.classList.remove('show');
        });
    }
    
    // Handle disable button click
    if (disableDndBtn) {
        disableDndBtn.addEventListener('click', () => {
            dndCheckbox.checked = false;
            dndNotification.classList.remove('show');
            // Store DND preference in local storage
            localStorage.setItem('dndMode', 'false');
        });
    }
    
    // Handle checkbox change
    if (dndCheckbox) {
        dndCheckbox.addEventListener('change', () => {
            // Store DND preference in local storage
            localStorage.setItem('dndMode', dndCheckbox.checked.toString());
        });
    }
    
    // Hide loader after page loads
    setTimeout(() => {
        document.getElementById('laptopLoader').style.display = 'none';
    }, 2000);

    // Initialize Bootstrap components
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Form validation
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });

    // Add scrolling effect to navbar
    const navbar = document.getElementsByName('navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            navbar.style.padding = '10px 0';
            navbar.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.classList.remove('scrolled');
            navbar.style.padding = '15px 0';
            navbar.style.boxShadow = 'none';
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                document.querySelectorAll('.navbar-nav .nav-link').forEach(navLink => {
                    navLink.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });

    // Initialize animation on scroll
    const animateElements = document.querySelectorAll('.service-box, .project-item, .about-image');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fadeInUp');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    animateElements.forEach(element => {
        observer.observe(element);
    });

    // Service Box Hover Effect
    document.querySelectorAll('.service-box').forEach(box => {
        box.addEventListener('mousemove', (e) => {
            const rect = box.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            box.style.setProperty('--mouse-x', `${x}px`);
            box.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Remember Me Functionality
    const rememberMeCheckbox = document.getElementById('rememberMe');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');

    if (rememberMeCheckbox && nameInput && emailInput) {
        // Load saved data
        const savedName = localStorage.getItem('rememberedName');
        const savedEmail = localStorage.getItem('rememberedEmail');
        const remembered = localStorage.getItem('rememberMe');
        
        if (remembered === 'true') {
            nameInput.value = savedName || '';
            emailInput.value = savedEmail || '';
            rememberMeCheckbox.checked = true;
        }
        
        // Save data when checkbox changes
        rememberMeCheckbox.addEventListener('change', () => {
            if (rememberMeCheckbox.checked) {
                localStorage.setItem('rememberedName', nameInput.value);
                localStorage.setItem('rememberedEmail', emailInput.value);
                localStorage.setItem('rememberMe', 'true');
            } else {
                localStorage.removeItem('rememberedName');
                localStorage.removeItem('rememberedEmail');
                localStorage.setItem('rememberMe', 'false');
            }
        });
    }

    // Flying Plane Animation Control
    const plane = document.querySelector('.flying-plane');
    if (plane) {
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            const scrollDiff = currentScrollY - lastScrollY;
            
            // Adjust plane speed based on scroll direction
            if (scrollDiff > 0) {
                plane.style.animationDuration = '15s'; // Faster when scrolling down
            } else if (scrollDiff < 0) {
                plane.style.animationDuration = '25s'; // Slower when scrolling up
            }
            
            lastScrollY = currentScrollY;
        });

        // Pause animation when not in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    plane.style.animationPlayState = 'running';
                } else {
                    plane.style.animationPlayState = 'paused';
                }
            });
        }, { threshold: 0.1 });

        observer.observe(plane);
    }

    // Google Search Functionality
    const searchInput = document.getElementById('google-search-input');
    const searchButton = document.getElementById('google-search-button');
    const searchResults = document.getElementById('search-results');
    
    if (searchInput && searchButton) {
        // Handle search button click
        searchButton.addEventListener('click', function() {
            performSearch();
        });
        
        // Handle Enter key press in search input
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        function performSearch() {
            const query = searchInput.value.trim();
            if (query === '') return;
            
            // Show loading state
            searchResults.innerHTML = `
                <div class="loading-search">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Searching for "${query}"...</p>
                </div>
            `;
            searchResults.classList.add('active');
            
            try {
                // Try to use the Google service if available
                if (window.googleServices && window.googleServices.search) {
                    window.googleServices.search.performSearch(query)
                        .then(results => {
                            searchResults.innerHTML = window.googleServices.search.formatSearchResults(results);
                        })
                        .catch(error => {
                            console.error('Error with Google search API:', error);
                            // Fallback to iframe search
                            searchResults.innerHTML = window.googleServices.search.createIframeSearch(query);
                        });
                } else {
                    // Fallback solution: Use Google embedded search
                    const encodedQuery = encodeURIComponent(query);
                    
                    searchResults.innerHTML = `
                        <div class="search-results-header">
                            <p>Search results for "${query}"</p>
                        </div>
                        <div class="embedded-search">
                            <iframe 
                                src="https://www.google.com/search?igu=1&q=${encodedQuery}" 
                                width="100%" 
                                height="500" 
                                frameborder="0"
                                style="border-radius: 8px; margin-top: 10px;"
                                sandbox="allow-scripts allow-same-origin allow-forms"
                            ></iframe>
                        </div>
                    `;
                }
            } catch (error) {
                console.error('Error with search:', error);
                searchResults.innerHTML = `
                    <div class="search-error">
                        <i class="fas fa-exclamation-circle"></i>
                        <p>Sorry, there was an error processing your search.</p>
                        <a href="https://www.google.com/search?q=${encodeURIComponent(query)}" target="_blank" class="btn btn-primary mt-3">
                            Search on Google Instead
                        </a>
                    </div>
                `;
            }
        }
    }
});

// Loading Animation
window.addEventListener('load', () => {
    const loader = document.querySelector('.loading-animation');
    if (loader) {
        loader.style.display = 'none';
    }
});

// Translation functionality
function toggleTranslateWidget() {
    const translateElement = document.getElementById('google_translate_element');
    translateElement.classList.toggle('show');
}

// Hide translate widget when clicking outside
document.addEventListener('click', function(event) {
    const translateButton = document.getElementById('google-translate-button');
    const translateElement = document.getElementById('google_translate_element');
    
    if (!translateButton.contains(event.target) && translateElement.classList.contains('show')) {
        translateElement.classList.remove('show');
    }
});

// Prevent hiding when clicking inside the widget
document.getElementById('google_translate_element').addEventListener('click', function(event) {
    event.stopPropagation();
});