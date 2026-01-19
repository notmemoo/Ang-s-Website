-- ============================================
-- SUPABASE DATABASE SETUP FOR ANGEL'S WEBSITE
-- Run this in Supabase SQL Editor
-- ============================================

-- Create the site_content table for storing editable content
CREATE TABLE IF NOT EXISTS site_content (
    id SERIAL PRIMARY KEY,
    section TEXT NOT NULL,
    key TEXT NOT NULL UNIQUE,
    value TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read content (for the public site)
CREATE POLICY "Public read access" ON site_content
    FOR SELECT USING (true);

-- Policy: Only authenticated users can update content
CREATE POLICY "Authenticated users can update" ON site_content
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Policy: Only authenticated users can insert content
CREATE POLICY "Authenticated users can insert" ON site_content
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- SEED DATA: Migrate current website content
-- ============================================

-- Home page content
INSERT INTO site_content (section, key, value) VALUES
    ('home', 'hero_tagline', 'Hi, I''m Angel'),
    ('home', 'hero_title', 'A Creative Soul Who Finds Purpose in Words'),
    ('home', 'hero_description', 'I write to help people feel seen, understood, and less alone. My books come from real experiences and a genuine desire to inspire growth, healing, and a more peaceful mindset.'),
    ('home', 'featured_book_title', 'Her Spirit Lives On: A Comforting Guide to Healing from the Loss of a Mother'),
    ('home', 'featured_book_description', 'A tender and compassionate guide for anyone navigating the profound journey of grief. This book offers gentle wisdom and heartfelt reflections to help you honor the memory of those you''ve lost while finding a path toward healing.'),
    ('home', 'featured_book_quote', 'A beautiful companion for the healing heart.'),
    ('home', 'featured_book_link', 'https://www.amazon.com/Her-Spirit-Lives-Comforting-Healing-ebook/dp/B0FLJNDD2X')
ON CONFLICT (key) DO NOTHING;

-- About page content
INSERT INTO site_content (section, key, value) VALUES
    ('about', 'about_title', 'Hi, I''m Angel'),
    ('about', 'about_subtitle', 'Self-help author, speaker, and your companion on the journey to becoming your best self.'),
    ('about', 'about_story_1', 'Like many of you, I didn''t always have it figured out. I spent years searching for meaning, struggling with self-doubt, and wondering if there was more to life than just going through the motions.'),
    ('about', 'about_story_2', 'Through my own journey of self-discovery—filled with challenges, breakthroughs, and countless lessons—I found my calling: helping others navigate their own paths to personal growth.'),
    ('about', 'about_story_3', 'Today, I write books and share insights that I wish someone had shared with me. My approach is practical, heart-centered, and rooted in the belief that everyone deserves to live a life that feels authentic and fulfilling.'),
    ('about', 'about_mission_quote', 'To help you discover the wisdom within yourself and give you the practical tools to create a life you truly love.'),
    ('about', 'about_mission_text', 'I believe that self-improvement shouldn''t feel like a chore. It should feel like coming home to yourself—gentle, nurturing, and deeply transformative.')
ON CONFLICT (key) DO NOTHING;

-- Contact page content
INSERT INTO site_content (section, key, value) VALUES
    ('contact', 'contact_title', 'Get in Touch'),
    ('contact', 'contact_subtitle', 'Have a question or want to work together? I''d love to hear from you.'),
    ('contact', 'contact_email', 'hello@angel.com'),
    ('contact', 'contact_social', '@angel on Instagram, Twitter, Facebook')
ON CONFLICT (key) DO NOTHING;

-- Blog & Books page content
INSERT INTO site_content (section, key, value) VALUES
    ('blog', 'blog_subtitle', 'Thoughts on personal growth, mindfulness, and intentional living.'),
    ('books', 'books_subtitle', 'Each book is written to help you on your journey to becoming your best self.')
ON CONFLICT (key) DO NOTHING;
