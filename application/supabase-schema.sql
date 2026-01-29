-- =============================================
-- LEASEON - Supabase Database Schema
-- Kør dette script i Supabase SQL Editor
-- =============================================

-- =============================================
-- 1. TABELLER
-- =============================================

-- Profiles tabel (linket til auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name VARCHAR(191) NOT NULL,
    last_name VARCHAR(191) NOT NULL,
    email VARCHAR(191) NOT NULL UNIQUE,
    phone VARCHAR(50),
    city VARCHAR(255),
    facebook_profile VARCHAR(255),
    profile_picture_path VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bilmærker
CREATE TABLE IF NOT EXISTS carbrands (
    brand_id SERIAL PRIMARY KEY,
    brand_name VARCHAR(255) NOT NULL UNIQUE
);

-- Udstyr/Equipment
CREATE TABLE IF NOT EXISTS equipment (
    equipment_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Bilannoncer
CREATE TABLE IF NOT EXISTS carlistings (
    listing_id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    be_listed SMALLINT NOT NULL DEFAULT 1,
    description VARCHAR(1900),
    type VARCHAR(255),
    form VARCHAR(255),
    brand_id INTEGER REFERENCES carbrands(brand_id),
    model VARCHAR(255),
    model_year INTEGER,
    fuel_type VARCHAR(255),
    transmission_type VARCHAR(50),
    variant VARCHAR(255),
    horsepower INTEGER,
    color VARCHAR(255),
    service_book VARCHAR(50),
    km_status INTEGER,
    condition_status VARCHAR(100),
    leasing_type VARCHAR(100),
    ownership_transferable SMALLINT DEFAULT 0,
    instant_takeover SMALLINT DEFAULT 1,
    payment DECIMAL(10,2),
    month_payment DECIMAL(20,0) NOT NULL,
    lease_period VARCHAR(20) DEFAULT '12 måneder',
    restvalue DECIMAL(10,2),
    discount DECIMAL(10,2),
    reserve_price DECIMAL(10,2),
    tax_included SMALLINT DEFAULT 0,
    offer_validity DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Junction tabel: Listing <-> Equipment
CREATE TABLE IF NOT EXISTS carlistingequipment (
    listing_id INTEGER NOT NULL REFERENCES carlistings(listing_id) ON DELETE CASCADE,
    equipment_id INTEGER NOT NULL REFERENCES equipment(equipment_id) ON DELETE CASCADE,
    PRIMARY KEY (listing_id, equipment_id)
);

-- Billeder til annoncer
CREATE TABLE IF NOT EXISTS listingimages (
    image_id SERIAL PRIMARY KEY,
    listing_id INTEGER REFERENCES carlistings(listing_id) ON DELETE CASCADE,
    image_path VARCHAR(255),
    is_primary SMALLINT DEFAULT 0,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- =============================================
-- 2. INDEXES
-- =============================================

CREATE INDEX IF NOT EXISTS idx_carlistings_brand_id ON carlistings(brand_id);
CREATE INDEX IF NOT EXISTS idx_carlistings_user_id ON carlistings(user_id);
CREATE INDEX IF NOT EXISTS idx_carlistings_be_listed ON carlistings(be_listed);
CREATE INDEX IF NOT EXISTS idx_listingimages_listing_id ON listingimages(listing_id);
CREATE INDEX IF NOT EXISTS idx_carlistingequipment_listing_id ON carlistingequipment(listing_id);
CREATE INDEX IF NOT EXISTS idx_carlistingequipment_equipment_id ON carlistingequipment(equipment_id);

-- =============================================
-- 3. RPC FUNCTIONS
-- =============================================

-- Funktion til at hente modeller for et bestemt bilmærke
CREATE OR REPLACE FUNCTION get_car_models_by_brand(brand_name_param TEXT)
RETURNS TABLE(model TEXT) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT cl.model::TEXT
    FROM carlistings cl
    JOIN carbrands cb ON cl.brand_id = cb.brand_id
    WHERE cb.brand_name = brand_name_param
    AND cl.model IS NOT NULL
    ORDER BY cl.model;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 4. ROW LEVEL SECURITY (RLS)
-- =============================================

-- Aktiver RLS på alle tabeller
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE carlistings ENABLE ROW LEVEL SECURITY;
ALTER TABLE listingimages ENABLE ROW LEVEL SECURITY;
ALTER TABLE carlistingequipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE carbrands ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;

-- PROFILES Policies
CREATE POLICY "Brugere kan se deres egen profil" ON profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Brugere kan opdatere deres egen profil" ON profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Brugere kan oprette deres egen profil" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Alle kan se profiler (kontaktinfo)" ON profiles
    FOR SELECT USING (true);

-- CARLISTINGS Policies
CREATE POLICY "Alle kan se aktive annoncer" ON carlistings
    FOR SELECT USING (be_listed = 1 OR auth.uid() = user_id);

CREATE POLICY "Brugere kan oprette annoncer" ON carlistings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Brugere kan opdatere egne annoncer" ON carlistings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Brugere kan slette egne annoncer" ON carlistings
    FOR DELETE USING (auth.uid() = user_id);

-- LISTINGIMAGES Policies
CREATE POLICY "Alle kan se billeder" ON listingimages
    FOR SELECT USING (true);

CREATE POLICY "Brugere kan uploade billeder" ON listingimages
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Brugere kan slette egne billeder" ON listingimages
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Brugere kan opdatere egne billeder" ON listingimages
    FOR UPDATE USING (auth.uid() = user_id);

-- CARLISTINGEQUIPMENT Policies
CREATE POLICY "Alle kan se udstyr på annoncer" ON carlistingequipment
    FOR SELECT USING (true);

CREATE POLICY "Brugere kan tilføje udstyr til egne annoncer" ON carlistingequipment
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM carlistings 
            WHERE carlistings.listing_id = carlistingequipment.listing_id 
            AND carlistings.user_id = auth.uid()
        )
    );

CREATE POLICY "Brugere kan slette udstyr fra egne annoncer" ON carlistingequipment
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM carlistings 
            WHERE carlistings.listing_id = carlistingequipment.listing_id 
            AND carlistings.user_id = auth.uid()
        )
    );

-- CARBRANDS Policies (kun læsning for alle)
CREATE POLICY "Alle kan se bilmærker" ON carbrands
    FOR SELECT USING (true);

-- EQUIPMENT Policies (kun læsning for alle)
CREATE POLICY "Alle kan se udstyr" ON equipment
    FOR SELECT USING (true);

-- =============================================
-- 5. SEED DATA - Bilmærker
-- =============================================

INSERT INTO carbrands (brand_name) VALUES
    ('Audi'),
    ('BMW'),
    ('Citroën'),
    ('Cupra'),
    ('Dacia'),
    ('DS'),
    ('Fiat'),
    ('Ford'),
    ('Honda'),
    ('Hyundai'),
    ('Jaguar'),
    ('Jeep'),
    ('Kia'),
    ('Land Rover'),
    ('Lexus'),
    ('Mazda'),
    ('Mercedes-Benz'),
    ('Mini'),
    ('Mitsubishi'),
    ('Nissan'),
    ('Opel'),
    ('Peugeot'),
    ('Porsche'),
    ('Renault'),
    ('Seat'),
    ('Skoda'),
    ('Suzuki'),
    ('Tesla'),
    ('Toyota'),
    ('Volkswagen'),
    ('Volvo')
ON CONFLICT (brand_name) DO NOTHING;

-- =============================================
-- 6. SEED DATA - Udstyr
-- =============================================

INSERT INTO equipment (name) VALUES
    ('Aircondition'),
    ('Læder Sæder'),
    ('Bluetooth'),
    ('Alufælge'),
    ('Adaptiv undervogn'),
    ('Anhæng. aftageligt'),
    ('Anhængertræk alm.'),
    ('Android Auto'),
    ('Auto Nødbremse'),
    ('Adaptiv Fartpilot'),
    ('Apple Carplay'),
    ('ABS Bremser'),
    ('Auto Parkering'),
    ('Auto. Start/Stop'),
    ('Automatgear'),
    ('Automatisk Lys'),
    ('Bakkamera'),
    ('Blindvinkelsassistent'),
    ('Dæktryksmåler'),
    ('El. komfortsæder'),
    ('Elektronisk bagklap'),
    ('Elruder'),
    ('Fartpilot'),
    ('Fjernlysassistent'),
    ('GPS Navigation'),
    ('Headup Display'),
    ('Internet'),
    ('Klimaanlæg'),
    ('Kurvelys'),
    ('LED Forlygter'),
    ('Nightvision'),
    ('Nøglefri Betjening'),
    ('Panoramatag'),
    ('Parkeringssensor'),
    ('Servostyring'),
    ('Soltag'),
    ('Soltag (elektrisk)'),
    ('Sædevarme'),
    ('Vognbaneassistent'),
    ('Xenonlygter')
ON CONFLICT DO NOTHING;
