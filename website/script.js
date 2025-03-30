// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
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

    // Activate sections on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
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

    // Tab functionality for projects
    const filterButtons = document.querySelectorAll('#projectTabs .nav-link');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-bs-target');
            
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            if (filterValue === '.all-projects') {
                document.querySelectorAll('.project-container .col-md-4').forEach(item => {
                    item.style.display = 'block';
                });
            } else {
                document.querySelectorAll('.project-container .col-md-4').forEach(item => {
                    if (!item.classList.contains(filterValue.substring(1))) {
                        item.style.display = 'none';
                    } else {
                        item.style.display = 'block';
                    }
                });
            }
        });
    });

    // Book Animation
    const book = document.getElementById('interactiveBook');
    let isOpen = false;

    book.addEventListener('click', function() {
        if (!isOpen) {
            book.classList.add('opened');
            isOpen = true;
        } else {
            book.classList.remove('opened');
            isOpen = false;
        }
    });

    // Add hover effect
    book.addEventListener('mousemove', function(e) {
        if (!isOpen) {
            const rect = book.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const rotateY = ((x / rect.width) * 30) - 15; // -15 to 15 degrees
            book.style.transform = `rotateY(${rotateY}deg)`;
        }
    });

    // Reset transform on mouse leave
    book.addEventListener('mouseleave', function() {
        if (!isOpen) {
            book.style.transform = 'rotateY(0deg)';
        }
    });
});

// Loading Animation
window.addEventListener('load', () => {
    const loader = document.querySelector('.loading-animation');
    if (loader) {
        loader.style.display = 'none';
    }
});

// Animate Elements on Scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.service-box, .project-item, .about-image');
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (elementTop < windowHeight - 100) {
            element.classList.add('animate-fadeInUp');
        }
    });
};

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

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

// Form Validation and Animation
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const submitButton = contactForm.querySelector('button[type="submit"]');
        
        // Add loading state
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            submitButton.innerHTML = '<i class="fas fa-check"></i> Sent Successfully!';
            submitButton.classList.add('btn-success');
            
            // Reset form after delay
            setTimeout(() => {
                contactForm.reset();
                submitButton.innerHTML = 'Send Message';
                submitButton.classList.remove('btn-success');
                submitButton.disabled = false;
            }, 3000);
        }, 2000);
    });
}

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

// Project Filter Animation
document.querySelectorAll('#projectTabs .nav-link').forEach(tab => {
    tab.addEventListener('click', function() {
        const target = this.dataset.bsTarget;
        document.querySelectorAll('.project-item').forEach(item => {
            item.style.opacity = '0';
            setTimeout(() => {
                if (target === '.all-projects' || item.classList.contains(target.substring(1))) {
                    item.style.display = 'block';
                    setTimeout(() => item.style.opacity = '1', 50);
                } else {
                    item.style.display = 'none';
                }
            }, 300);
        });
    });
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Chat Widget Elements
const chatWidget = document.getElementById('chatWidget');
const chatToggle = document.getElementById('chatToggle');
const closeChat = document.getElementById('closeChat');
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendMessage = document.getElementById('sendMessage');
const messageCount = document.getElementById('messageCount');

// API Configuration
const API_KEY = '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';
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Chat State
let unreadMessages = 0;

// Event Listeners
chatToggle.addEventListener('click', () => {
    chatWidget.classList.add('active');
    unreadMessages = 0;
    messageCount.classList.remove('active');
});

closeChat.addEventListener('click', () => {
    chatWidget.classList.remove('active');
});

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendUserMessage();
    }
});

sendMessage.addEventListener('click', sendUserMessage);

// Auto-resize textarea
userInput.addEventListener('input', () => {
    userInput.style.height = 'auto';
    userInput.style.height = userInput.scrollHeight + 'px';
});

// Functions
function sendUserMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // Add user message to chat
    addMessage(message, 'user');
    userInput.value = '';
    userInput.style.height = 'auto';

    // Show loading message
    const loadingMessage = addMessage('Thinking...', 'bot', true);

    // Call API
    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'HTTP-Referer': window.location.origin,
            'X-Title': 'Educare Chat',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'model': 'qwen/qwen2.5-vl-3b-instruct:free',
            'messages': [
                {
                    'role': 'user',
                    'content': message
                }
            ]
        })
    })
    .then(response => response.json())
    .then(data => {
        // Remove loading message
        loadingMessage.remove();

        // Add bot response
        if (data.choices && data.choices[0]) {
            addMessage(data.choices[0].message.content, 'bot');
        } else {
            addMessage('Sorry, I encountered an error. Please try again.', 'bot');
        }
    })
    .catch(error => {
        // Remove loading message
        loadingMessage.remove();

        // Show error message
        addMessage('Sorry, I encountered an error. Please try again.', 'bot');
        console.error('Error:', error);
    });
}

function addMessage(content, type, isLoading = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}${isLoading ? ' loading' : ''}`;
    messageDiv.textContent = content;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Update notification badge if chat is closed
    if (!chatWidget.classList.contains('active')) {
        unreadMessages++;
        messageCount.textContent = unreadMessages;
        messageCount.classList.add('active');
    }

    return messageDiv;
}

// Initialize chat
chatWidget.classList.remove('active');

// Laptop Loading Animation
document.addEventListener('DOMContentLoaded', () => {
    const laptopLoader = document.querySelector('.laptop-loader');
    
    // Hide loader after animation
    setTimeout(() => {
        laptopLoader.classList.add('fade-out');
        setTimeout(() => {
            laptopLoader.style.display = 'none';
        }, 300);
    }, 1500); // Reduced from 3000 to 1500
});