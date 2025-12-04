-- Migración de Firebase a PostgreSQL
-- Script de creación de tablas

-- Resultados
CREATE TABLE IF NOT EXISTS resultados (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    prompt TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "imageUrl2" TEXT,
    "imageUrl3" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT,
    description TEXT,
    "imageUrl" TEXT,
    "imageHint" TEXT,
    url TEXT,
    type TEXT NOT NULL DEFAULT 'project',
    "htmlContent" TEXT,
    "categoryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Images
CREATE TABLE IF NOT EXISTS images (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    "storagePath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tools
CREATE TABLE IF NOT EXISTS tools (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    description TEXT,
    "imageUrl" TEXT,
    url TEXT,
    price DOUBLE PRECISION,
    "paymentDay" INTEGER,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "categoryIds" TEXT[] DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tool Categories
CREATE TABLE IF NOT EXISTS tool_categories (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Protocols
CREATE TABLE IF NOT EXISTS protocols (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Protocol Steps
CREATE TABLE IF NOT EXISTS protocol_steps (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT,
    description TEXT,
    "imageUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "protocolId" TEXT NOT NULL REFERENCES protocols(id) ON DELETE CASCADE
);

-- Team Items
CREATE TABLE IF NOT EXISTS team_items (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    position TEXT NOT NULL,
    bio TEXT,
    "imageUrl" TEXT,
    email TEXT,
    "linkedinUrl" TEXT,
    "portfolioUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Sajor Items
CREATE TABLE IF NOT EXISTS sajor_items (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    url TEXT,
    description TEXT,
    notes TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Aprende Pages
CREATE TABLE IF NOT EXISTS aprende_pages (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    "htmlText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "heroEnabled" BOOLEAN NOT NULL DEFAULT false,
    "heroTitle" TEXT,
    "heroDescription" TEXT,
    "heroCtaText" TEXT,
    "heroCtaUrl" TEXT,
    "heroImageUrl" TEXT,
    "featureSectionEnabled" BOOLEAN NOT NULL DEFAULT false,
    "featureSectionTitle" TEXT,
    "featureSectionDescription" TEXT,
    "featureSectionCtaText" TEXT,
    "featureSectionCtaUrl" TEXT,
    "stepsSectionEnabled" BOOLEAN NOT NULL DEFAULT false,
    "iconListSectionEnabled" BOOLEAN NOT NULL DEFAULT false,
    "iconListSectionDescription" TEXT,
    "mediaGridSectionEnabled" BOOLEAN NOT NULL DEFAULT false,
    "pricingSectionEnabled" BOOLEAN NOT NULL DEFAULT false,
    "fullWidthMediaSectionEnabled" BOOLEAN NOT NULL DEFAULT false,
    "fullWidthMediaSectionTitle" TEXT,
    "fullWidthMediaSectionDescription" TEXT,
    "fullWidthMediaSectionImageUrl" TEXT,
    "fullWidthMediaSectionVideoUrl" TEXT,
    "faqSectionEnabled" BOOLEAN NOT NULL DEFAULT false,
    "openQuestionnaireEnabled" BOOLEAN NOT NULL DEFAULT false,
    "openQuestionnaireTitle" TEXT,
    "checkboxQuestionnaireEnabled" BOOLEAN NOT NULL DEFAULT false,
    "checkboxQuestionnaireTitle" TEXT,
    "contactFormEnabled" BOOLEAN NOT NULL DEFAULT false,
    "contactFormTitle" TEXT,
    "contactFormShowName" BOOLEAN NOT NULL DEFAULT false,
    "contactFormShowPhone" BOOLEAN NOT NULL DEFAULT false,
    "contactFormShowEmail" BOOLEAN NOT NULL DEFAULT false,
    "contactFormShowTextMessage" BOOLEAN NOT NULL DEFAULT false,
    "contactFormShowInstagram" BOOLEAN NOT NULL DEFAULT false,
    "contactFormShowFacebook" BOOLEAN NOT NULL DEFAULT false,
    "contactFormShowLinkedIn" BOOLEAN NOT NULL DEFAULT false,
    "contactFormShowTikTok" BOOLEAN NOT NULL DEFAULT false,
    "ctaSectionEnabled" BOOLEAN NOT NULL DEFAULT false,
    "ctaSectionTitle" TEXT,
    "ctaSectionDescription" TEXT,
    "ctaSectionButtonText" TEXT,
    "ctaSectionButtonUrl" TEXT
);

-- Aprende Feature Cards
CREATE TABLE IF NOT EXISTS aprende_feature_cards (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    icon TEXT,
    title TEXT,
    description TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "aprendePageId" TEXT NOT NULL REFERENCES aprende_pages(id) ON DELETE CASCADE
);

-- Aprende Step Items
CREATE TABLE IF NOT EXISTS aprende_step_items (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT,
    description TEXT,
    "imageUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "aprendePageId" TEXT NOT NULL REFERENCES aprende_pages(id) ON DELETE CASCADE
);

-- Aprende Icon List Items
CREATE TABLE IF NOT EXISTS aprende_icon_list_items (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    icon TEXT,
    title TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "aprendePageId" TEXT NOT NULL REFERENCES aprende_pages(id) ON DELETE CASCADE
);

-- Aprende Media Grid Cards
CREATE TABLE IF NOT EXISTS aprende_media_grid_cards (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT,
    description TEXT,
    "imageUrl" TEXT,
    "videoUrl" TEXT,
    "ctaText" TEXT,
    "ctaUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "aprendePageId" TEXT NOT NULL REFERENCES aprende_pages(id) ON DELETE CASCADE
);

-- Aprende Pricing Cards
CREATE TABLE IF NOT EXISTS aprende_pricing_cards (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "htmlContent" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "aprendePageId" TEXT NOT NULL REFERENCES aprende_pages(id) ON DELETE CASCADE
);

-- Aprende FAQ Items
CREATE TABLE IF NOT EXISTS aprende_faq_items (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "aprendePageId" TEXT NOT NULL REFERENCES aprende_pages(id) ON DELETE CASCADE
);

-- Aprende Open Questions
CREATE TABLE IF NOT EXISTS aprende_open_questions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    question TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "aprendePageId" TEXT NOT NULL REFERENCES aprende_pages(id) ON DELETE CASCADE
);

-- Aprende Checkbox Questions
CREATE TABLE IF NOT EXISTS aprende_checkbox_questions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    question TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "aprendePageId" TEXT NOT NULL REFERENCES aprende_pages(id) ON DELETE CASCADE
);

-- Aprende Checkbox Question Options
CREATE TABLE IF NOT EXISTS aprende_checkbox_question_options (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    label TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "questionId" TEXT NOT NULL REFERENCES aprende_checkbox_questions(id) ON DELETE CASCADE
);

-- Formations
CREATE TABLE IF NOT EXISTS formations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    url TEXT,
    tag TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- N8N Servers
CREATE TABLE IF NOT EXISTS n8n_servers (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    code TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- N8N Templates
CREATE TABLE IF NOT EXISTS n8n_templates (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    "jsonContent" TEXT,
    "htmlContent" TEXT,
    url TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Links
CREATE TABLE IF NOT EXISTS links (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    tag TEXT NOT NULL,
    "cardId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Link Cards
CREATE TABLE IF NOT EXISTS link_cards (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Prompts
CREATE TABLE IF NOT EXISTS prompts (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    "promptText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Notes
CREATE TABLE IF NOT EXISTS notes (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    description TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Designs
CREATE TABLE IF NOT EXISTS designs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- HTML Pages
CREATE TABLE IF NOT EXISTS html_pages (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    "htmlContent" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Shorts
CREATE TABLE IF NOT EXISTS shorts (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    "youtubeUrl" TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Git Protocols
CREATE TABLE IF NOT EXISTS git_protocols (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    description TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Git Steps
CREATE TABLE IF NOT EXISTS git_steps (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "gitCommand" TEXT,
    description TEXT,
    "imageUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "gitProtocolId" TEXT NOT NULL REFERENCES git_protocols(id) ON DELETE CASCADE
);

-- Services
CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    "iconUrl" TEXT NOT NULL,
    url TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Hero Content
CREATE TABLE IF NOT EXISTS hero_content (
    id TEXT PRIMARY KEY DEFAULT 'main',
    description TEXT NOT NULL,
    "backgroundImageUrl" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Hero Buttons
CREATE TABLE IF NOT EXISTS hero_buttons (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    text TEXT NOT NULL,
    url TEXT NOT NULL,
    variant TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "heroContentId" TEXT NOT NULL REFERENCES hero_content(id) ON DELETE CASCADE
);

-- About Content
CREATE TABLE IF NOT EXISTS about_content (
    id TEXT PRIMARY KEY DEFAULT 'main',
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Blog Categories
CREATE TABLE IF NOT EXISTS blog_categories (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_resultados_created ON resultados("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_projects_created ON projects("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_images_created ON images("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_tools_created ON tools("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_protocols_created ON protocols("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_protocol_steps_protocol ON protocol_steps("protocolId");
CREATE INDEX IF NOT EXISTS idx_team_items_created ON team_items("createdAt" ASC);
CREATE INDEX IF NOT EXISTS idx_aprende_pages_code ON aprende_pages(code);
CREATE INDEX IF NOT EXISTS idx_links_card ON links("cardId");
CREATE INDEX IF NOT EXISTS idx_git_steps_protocol ON git_steps("gitProtocolId");
