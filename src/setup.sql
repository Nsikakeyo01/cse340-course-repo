
-- ============================================
-- W06 Database Setup
-- CSE 340 Service Network
-- ============================================

-- ============================================
-- Remove existing tables if they exist
-- ============================================

DROP TABLE IF EXISTS volunteers;
DROP TABLE IF EXISTS project_categories;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS organizations;
DROP TABLE IF EXISTS users;


-- ============================================
-- Users
-- ============================================

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user'
);


-- ============================================
-- Organizations
-- ============================================

CREATE TABLE organizations (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);


-- ============================================
-- Categories
-- ============================================

CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);


-- ============================================
-- Service Projects
-- ============================================

CREATE TABLE projects (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    location VARCHAR(150),
    project_date DATE NOT NULL,

    CONSTRAINT fk_project_organization
        FOREIGN KEY (organization_id)
        REFERENCES organizations (organization_id)
        ON DELETE CASCADE
);


-- ============================================
-- Project Categories
-- Many-to-many relationship
-- ============================================

CREATE TABLE project_categories (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,

    PRIMARY KEY (project_id, category_id),

    CONSTRAINT fk_project_categories_project
        FOREIGN KEY (project_id)
        REFERENCES projects (project_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_project_categories_category
        FOREIGN KEY (category_id)
        REFERENCES categories (category_id)
        ON DELETE CASCADE
);


-- ============================================
-- Volunteers
-- W06 many-to-many relationship
-- Users can volunteer for multiple projects.
-- Projects can have multiple volunteers.
-- ============================================

CREATE TABLE volunteers (
    user_id INTEGER NOT NULL,
    project_id INTEGER NOT NULL,

    PRIMARY KEY (user_id, project_id),

    CONSTRAINT fk_volunteers_user
        FOREIGN KEY (user_id)
        REFERENCES users (user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_volunteers_project
        FOREIGN KEY (project_id)
        REFERENCES projects (project_id)
        ON DELETE CASCADE
);


-- ============================================
-- Sample Organizations
-- ============================================

INSERT INTO organizations
    (name, description, contact_email, logo_filename)
VALUES
    (
        'BrightFuture Builders',
        'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
        'info@brightfuturebuilders.org',
        'brightfuture-logo.png'
    ),
    (
        'GreenHarvest Growers',
        'An urban farming collective promoting food sustainability and education in local neighborhoods.',
        'contact@greenharvest.org',
        'greenharvest-logo.png'
    ),
    (
        'UnityServe Volunteers',
        'A volunteer coordination group supporting local charities and service initiatives.',
        'hello@unityserve.org',
        'unityserve-logo.png'
    );


-- ============================================
-- Sample Categories
-- ============================================

INSERT INTO categories (name)
VALUES
    ('Education'),
    ('Environment'),
    ('Community Development'),
    ('Health'),
    ('Food Security');


-- ============================================
-- Sample Service Projects
-- ============================================

INSERT INTO projects
    (organization_id, title, description, location, project_date)
VALUES

    -- BrightFuture Builders

    (
        1,
        'After-School Tutoring',
        'Provide academic support to local students.',
        'Community Learning Center',
        '2026-09-15'
    ),

    (
        1,
        'Digital Literacy Workshop',
        'Teach basic computer and internet skills.',
        'Bright Future Center',
        '2026-09-20'
    ),

    (
        1,
        'School Supplies Drive',
        'Collect and distribute school supplies to students.',
        'Community Hall',
        '2026-09-25'
    ),

    (
        1,
        'Youth Mentorship Program',
        'Connect young people with positive community mentors.',
        'Bright Future Center',
        '2026-10-01'
    ),

    (
        1,
        'Reading Club',
        'Encourage reading and literacy among children.',
        'Local Library',
        '2026-10-05'
    ),

    -- GreenHarvest Growers

    (
        2,
        'Community Garden',
        'Create and maintain a garden for local residents.',
        'Green Harvest Farm',
        '2026-09-18'
    ),

    (
        2,
        'Tree Planting Day',
        'Plant trees to improve the local environment.',
        'Community Park',
        '2026-09-22'
    ),

    (
        2,
        'Recycling Campaign',
        'Educate residents about recycling and waste reduction.',
        'City Community Center',
        '2026-09-28'
    ),

    (
        2,
        'Clean Water Initiative',
        'Support clean water awareness and conservation.',
        'River Community',
        '2026-10-03'
    ),

    (
        2,
        'Environmental Awareness Fair',
        'Promote sustainable living and environmental responsibility.',
        'Green Harvest Farm',
        '2026-10-10'
    ),

    -- UnityServe Volunteers

    (
        3,
        'Community Food Drive',
        'Collect food donations for families in need.',
        'Unity Serve Center',
        '2026-09-17'
    ),

    (
        3,
        'Neighborhood Cleanup',
        'Bring volunteers together to clean public areas.',
        'Central Neighborhood',
        '2026-09-24'
    ),

    (
        3,
        'Health Awareness Day',
        'Provide health education and wellness information.',
        'Unity Serve Center',
        '2026-09-30'
    ),

    (
        3,
        'Senior Support Program',
        'Provide assistance and companionship to senior citizens.',
        'Community Senior Center',
        '2026-10-06'
    ),

    (
        3,
        'Community Volunteer Day',
        'Organize volunteers for various community service activities.',
        'Unity Serve Center',
        '2026-10-12'
    );


-- ============================================
-- Project Category Relationships
-- ============================================

INSERT INTO project_categories
    (project_id, category_id)
VALUES

    -- BrightFuture Builders
    (1, 1),
    (2, 1),
    (3, 1),
    (4, 1),
    (5, 1),

    -- GreenHarvest Growers
    (6, 2),
    (6, 5),
    (7, 2),
    (8, 2),
    (9, 2),
    (9, 4),
    (10, 2),

    -- UnityServe Volunteers
    (11, 5),
    (11, 3),
    (12, 3),
    (13, 4),
    (14, 3),
    (14, 4),
    (15, 3);
