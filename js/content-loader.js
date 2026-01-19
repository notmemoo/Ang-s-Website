// ============================================
// CONTENT LOADER
// Loads dynamic content from Supabase for public pages
// ============================================

// Initialize Supabase (uses config from supabase-config.js)
// Note: supabase-config.js must be loaded before this file

// Load content for a specific section
async function loadSiteContent(section) {
    try {
        const { data, error } = await supabaseClient
            .from('site_content')
            .select('key, value')
            .eq('section', section);

        if (error) throw error;

        // Build a lookup object
        const content = {};
        if (data) {
            data.forEach(item => {
                content[item.key] = item.value;
            });
        }

        return content;
    } catch (error) {
        console.error('Error loading content:', error);
        return {};
    }
}

// Update DOM elements with loaded content
function applyContent(content) {
    for (const [key, value] of Object.entries(content)) {
        const element = document.querySelector(`[data-content="${key}"]`);
        if (element && value) {
            // Handle different element types
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.value = value;
            } else if (element.tagName === 'A') {
                element.href = value;
            } else if (element.tagName === 'IMG') {
                element.src = value;
            } else {
                element.textContent = value;
            }
        }
    }
}

// Load and apply content for a page
async function initPageContent(section) {
    const content = await loadSiteContent(section);
    applyContent(content);
}
