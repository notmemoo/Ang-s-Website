// ============================================
// ADMIN PANEL JAVASCRIPT
// Handles authentication and content management
// ============================================

// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const loginForm = document.getElementById('loginForm');
const checkEmail = document.getElementById('checkEmail');
const loginError = document.getElementById('loginError');
const emailInput = document.getElementById('email');
const sendMagicLinkBtn = document.getElementById('sendMagicLink');
const tryAgainBtn = document.getElementById('tryAgain');
const sentToEmail = document.getElementById('sentToEmail');
const adminDashboard = document.getElementById('adminDashboard');
const logoutBtn = document.getElementById('logoutBtn');
const navItems = document.querySelectorAll('.nav-item');
const sectionTitle = document.getElementById('sectionTitle');
const contentArea = document.getElementById('contentArea');
const saveBtn = document.getElementById('saveBtn');
const saveStatus = document.getElementById('saveStatus');

// Current section being edited
let currentSection = 'home';
let contentCache = {};

// ============================================
// AUTHENTICATION
// ============================================

// Check if user is logged in on page load
async function checkAuth() {
    const { data: { session } } = await supabaseClient.auth.getSession();

    if (session) {
        showDashboard();
        loadContent(currentSection);
    } else {
        showLogin();
    }
}

// Send magic link
async function sendMagicLink() {
    const email = emailInput.value.trim();

    if (!email) {
        showError('Please enter your email address');
        return;
    }

    sendMagicLinkBtn.disabled = true;
    sendMagicLinkBtn.textContent = 'Sending...';

    try {
        const { error } = await supabaseClient.auth.signInWithOtp({
            email: email,
            options: {
                emailRedirectTo: 'https://angsite.vercel.app/admin.html'
            }
        });

        if (error) throw error;

        // Show "check email" message
        loginForm.style.display = 'none';
        checkEmail.style.display = 'block';
        sentToEmail.textContent = email;
        loginError.style.display = 'none';

    } catch (error) {
        showError(error.message || 'Failed to send magic link');
    } finally {
        sendMagicLinkBtn.disabled = false;
        sendMagicLinkBtn.textContent = 'Send Magic Link';
    }
}

// Logout
async function logout() {
    await supabaseClient.auth.signOut();
    showLogin();
}

// Show login screen
function showLogin() {
    loginScreen.style.display = 'flex';
    adminDashboard.style.display = 'none';
    loginForm.style.display = 'block';
    checkEmail.style.display = 'none';
    loginError.style.display = 'none';
    emailInput.value = '';
}

// Show dashboard
function showDashboard() {
    loginScreen.style.display = 'none';
    adminDashboard.style.display = 'flex';
}

// Show error message
function showError(message) {
    loginError.textContent = message;
    loginError.style.display = 'block';
}

// ============================================
// CONTENT MANAGEMENT
// ============================================

// Content templates for each section
const sectionTemplates = {
    home: `
        <div class="form-section">
            <h3>Hero Section</h3>
            <div class="form-group">
                <label>Tagline</label>
                <input type="text" id="hero_tagline" placeholder="Hi, I'm Angel">
                <p class="hint">The small text above your main headline</p>
            </div>
            <div class="form-group">
                <label>Main Headline</label>
                <input type="text" id="hero_title" placeholder="A Creative Soul Who Finds Purpose in Words">
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea id="hero_description" placeholder="I write to help people feel seen..."></textarea>
            </div>
        </div>
        <div class="form-section">
            <h3>Featured Book</h3>
            <div class="form-group">
                <label>Book Title</label>
                <input type="text" id="featured_book_title">
            </div>
            <div class="form-group">
                <label>Book Description</label>
                <textarea id="featured_book_description"></textarea>
            </div>
            <div class="form-group">
                <label>Quote/Testimonial</label>
                <input type="text" id="featured_book_quote">
            </div>
            <div class="form-group">
                <label>Amazon Link</label>
                <input type="url" id="featured_book_link" placeholder="https://amazon.com/...">
            </div>
        </div>
    `,
    about: `
        <div class="form-section">
            <h3>About Hero</h3>
            <div class="form-group">
                <label>Page Title</label>
                <input type="text" id="about_title" placeholder="Hi, I'm Angel">
            </div>
            <div class="form-group">
                <label>Subtitle</label>
                <textarea id="about_subtitle" placeholder="Self-help author, speaker..."></textarea>
            </div>
        </div>
        <div class="form-section">
            <h3>My Story</h3>
            <div class="form-group">
                <label>Story Paragraph 1</label>
                <textarea id="about_story_1"></textarea>
            </div>
            <div class="form-group">
                <label>Story Paragraph 2</label>
                <textarea id="about_story_2"></textarea>
            </div>
            <div class="form-group">
                <label>Story Paragraph 3</label>
                <textarea id="about_story_3"></textarea>
            </div>
        </div>
        <div class="form-section">
            <h3>My Mission</h3>
            <div class="form-group">
                <label>Mission Quote</label>
                <textarea id="about_mission_quote"></textarea>
            </div>
            <div class="form-group">
                <label>Mission Description</label>
                <textarea id="about_mission_text"></textarea>
            </div>
        </div>
    `,
    books: `
        <div class="form-section">
            <h3>Books Page Title</h3>
            <div class="form-group">
                <label>Page Subtitle</label>
                <input type="text" id="books_subtitle" placeholder="Each book is written to help you...">
            </div>
        </div>
        <p style="color: #718096; padding: 20px; text-align: center;">
            📚 Individual book editing coming soon! For now, books are managed in the code.
        </p>
    `,
    blog: `
        <div class="form-section">
            <h3>Blog Page Title</h3>
            <div class="form-group">
                <label>Page Subtitle</label>
                <input type="text" id="blog_subtitle" placeholder="Thoughts on personal growth...">
            </div>
        </div>
        <p style="color: #718096; padding: 20px; text-align: center;">
            📝 Blog post management coming soon!
        </p>
    `,
    contact: `
        <div class="form-section">
            <h3>Contact Page</h3>
            <div class="form-group">
                <label>Page Title</label>
                <input type="text" id="contact_title" placeholder="Get in Touch">
            </div>
            <div class="form-group">
                <label>Page Subtitle</label>
                <textarea id="contact_subtitle" placeholder="Have a question or want to work together?"></textarea>
            </div>
        </div>
        <div class="form-section">
            <h3>Contact Information</h3>
            <div class="form-group">
                <label>Email Address</label>
                <input type="email" id="contact_email" placeholder="hello@angel.com">
            </div>
            <div class="form-group">
                <label>Social Media Handle</label>
                <input type="text" id="contact_social" placeholder="@angel on Instagram, Twitter...">
            </div>
        </div>
    `
};

const sectionTitles = {
    home: 'Home Page',
    about: 'About Page',
    books: 'Books',
    blog: 'Blog Posts',
    contact: 'Contact'
};

// Load content for a section
async function loadContent(section) {
    currentSection = section;
    sectionTitle.textContent = sectionTitles[section];
    contentArea.innerHTML = sectionTemplates[section];

    // Update active nav item
    navItems.forEach(item => {
        item.classList.toggle('active', item.dataset.section === section);
    });

    // Load saved content from database
    try {
        const { data, error } = await supabaseClient
            .from('site_content')
            .select('key, value')
            .eq('section', section);

        if (error) throw error;

        // Populate form fields
        if (data) {
            data.forEach(item => {
                const field = document.getElementById(item.key);
                if (field) {
                    field.value = item.value || '';
                }
            });
        }
    } catch (error) {
        console.log('No saved content yet or table not created:', error.message);
    }
}

// Save content
async function saveContent() {
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';

    try {
        // Get all input/textarea values in current section
        const inputs = contentArea.querySelectorAll('input, textarea');
        const updates = [];

        inputs.forEach(input => {
            if (input.id) {
                updates.push({
                    section: currentSection,
                    key: input.id,
                    value: input.value,
                    updated_at: new Date().toISOString()
                });
            }
        });

        // Upsert all content
        const { error } = await supabaseClient
            .from('site_content')
            .upsert(updates, { onConflict: 'key' });

        if (error) throw error;

        showSaveStatus('✓ Saved successfully!', 'success');

    } catch (error) {
        console.error('Save error:', error);
        showSaveStatus('Failed to save: ' + error.message, 'error');
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = '💾 Save Changes';
    }
}

// Show save status notification
function showSaveStatus(message, type) {
    saveStatus.textContent = message;
    saveStatus.className = `save-status show ${type}`;

    setTimeout(() => {
        saveStatus.classList.remove('show');
    }, 3000);
}

// ============================================
// EVENT LISTENERS
// ============================================

// Magic link button
sendMagicLinkBtn.addEventListener('click', sendMagicLink);

// Enter key on email input
emailInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMagicLink();
});

// Try again button
tryAgainBtn.addEventListener('click', () => {
    loginForm.style.display = 'block';
    checkEmail.style.display = 'none';
});

// Logout button
logoutBtn.addEventListener('click', logout);

// Navigation items
navItems.forEach(item => {
    item.addEventListener('click', () => {
        loadContent(item.dataset.section);
    });
});

// Save button
saveBtn.addEventListener('click', saveContent);

// Listen for auth state changes (for magic link redirect)
supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
        showDashboard();
        loadContent(currentSection);
    }
});

// Initialize
checkAuth();
