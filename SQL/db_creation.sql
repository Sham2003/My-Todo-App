
-- Create the app_users table
CREATE TABLE app_users (
    id INT PRIMARY KEY,
    uid TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    number TEXT,
    referral_code VARCHAR(50) UNIQUE, -- User's referral code
    referrer VARCHAR(50),             -- Referral code entered on signup
    refcount INT DEFAULT 0,           -- Count of referrals
);

-- Create the todos table
CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    uid TEXT NOT NULL,
    task TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uid) REFERENCES app_users(uid) ON DELETE CASCADE
);

-- Create a function to generate a unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
    new_code TEXT;
BEGIN
    -- Generate a random 6-character uppercase referral code
    new_code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));

    -- Ensure the code is unique by checking against the app_users table
    WHILE EXISTS (SELECT 1 FROM app_users WHERE referral_code = new_code) LOOP
        new_code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
    END LOOP;

    RETURN new_code;
END;
$function$

-- Create a trigger function to set referral code before inserting a user
CREATE OR REPLACE FUNCTION set_referral_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.referral_code IS NULL THEN
        NEW.referral_code := gen_referral_code(); -- Set the referral code
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a function to increment the refcount
CREATE OR REPLACE FUNCTION increment_refcount()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.referrer IS NOT NULL THEN
        UPDATE app_users
        SET refcount = refcount + 1
        WHERE referral_code = NEW.referrer;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a function to decrement the refcount
CREATE OR REPLACE FUNCTION decrement_refcount()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.referrer IS NOT NULL THEN
        UPDATE app_users
        SET refcount = refcount - 1
        WHERE referral_code = OLD.referrer;
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to set the referral code before inserting a new user
CREATE TRIGGER set_referral_code_trigger
BEFORE INSERT ON app_users
FOR EACH ROW
EXECUTE FUNCTION set_referral_code();

-- Create a trigger to increment the refcount after inserting a new user
CREATE TRIGGER increment_refcount_trigger
AFTER INSERT ON app_users
FOR EACH ROW
EXECUTE FUNCTION increment_refcount();

-- Create a trigger to decrement the refcount after deleting a user
CREATE TRIGGER decrement_refcount_trigger
AFTER DELETE ON app_users
FOR EACH ROW
EXECUTE FUNCTION decrement_refcount();




