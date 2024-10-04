-- Insert Tony Stark into table
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Modify Tony to have account_type of admin
UPDATE account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony';

-- Delete Tony from table
DELETE FROM account
WHERE account_firstname = 'Tony';

-- Replace small interior with big interior
UPDATE inventory 
SET inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior') 
WHERE inv_id = 10;

-- inner join on inventory and classification tables 
SELECT i.inv_make, i.inv_model, c.classification_name
FROM inventory i
INNER JOIN classification c ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

-- change image and thumbnail filepath so there is and /vehicles in the middle of it
UPDATE inventory
SET 
	inv_image = REPLACE(inv_image, '/images', '/images/vehicles'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles'); 