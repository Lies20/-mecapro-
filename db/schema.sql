CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    phone VARCHAR(20),
    vehicle_type VARCHAR(50),
    vehicle_model VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE garages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(10),
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    hourly_rate DECIMAL(6,2),
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE specialties (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE garage_specialties (
    garage_id UUID REFERENCES garages(id) ON DELETE CASCADE,
    specialty_id INT REFERENCES specialties(id) ON DELETE CASCADE,
    PRIMARY KEY (garage_id, specialty_id)
);

CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    garage_id UUID REFERENCES garages(id) ON DELETE CASCADE,
    specialty_id INT REFERENCES specialties(id),
    appointment_date TIMESTAMP NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    garage_id UUID REFERENCES garages(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id),
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    garage_id UUID REFERENCES garages(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id),
    caption TEXT,
    media_url TEXT NOT NULL,
    media_type VARCHAR(10) DEFAULT 'video',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE post_likes (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, post_id)
);

CREATE TABLE post_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID REFERENCES users(id),
    post_id UUID REFERENCES posts(id),
    garage_id UUID REFERENCES garages(id),
    reason TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO specialties (name) VALUES
('Révision'), ('Freinage'), ('Électronique'),
('Pneumatiques'), ('Carrosserie'), ('Climatisation'),
('Électrique'), ('Urgence 24h'), ('Vidange');