const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors');
const mysql = require('mysql');
const { expressjwt: expressJwt } = require('express-jwt');;
const path = require('path');

app.use(cors());
app.use(express.json());
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'leasevidere'
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});


// Insert the new endpoint here
app.get('/records', (req, res) => {
    const sql = 'SELECT * FROM carbrands';

    db.query(sql, (err, results) => {
        if (err) {
            throw err;
        }
        res.json(results);
    });
});


app.get('/models-by-brand', (req, res) => {
    const brandName = req.query.brand;
    const sql = `
        SELECT DISTINCT cl.model
        FROM carlistings cl
        JOIN carbrands cb ON cl.brand_id = cb.brand_id
        WHERE cb.brand_name = ?
    `;

    db.query(sql, [brandName], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        // Since `model` is a column in the result, we'll map over it to return an array of models.
        const models = results.map(row => row.model);
        res.json(models);
    });
});




// Function to construct SQL query with filters for the /all-listings endpoint
function constructFilteredQuery(params) {
    let baseQuery = `
    SELECT cl.*, cb.brand_name, 
            GROUP_CONCAT(li.image_path) AS images, 
            MAX(CASE WHEN li.is_primary = 1 THEN li.image_path ELSE NULL END) AS primary_image
        FROM carlistings cl
        LEFT JOIN carbrands cb ON cl.brand_id = cb.brand_id
        LEFT JOIN listingimages li ON cl.listing_id = li.listing_id
    `;
    // Starting with the condition to exclude listings with be_listed = 0
    let whereConditions = ['cl.be_listed <> 0'];
    let queryParams = [];

    // Filter by brand
    if (params.brand && params.brand.trim() !== '') {
        whereConditions.push('cb.brand_name = ?');
        queryParams.push(params.brand.trim());
    }

    // Filter by fuel type
    if (params.fuel_type && params.fuel_type.trim() !== '') {
        whereConditions.push('cl.fuel_type = ?');
        queryParams.push(params.fuel_type.trim());
    }

    // Filter by transmission type (gearkasse)
    if (params.transmission_type && params.transmission_type.trim() !== '') {
        whereConditions.push('cl.transmission_type = ?');
        queryParams.push(params.transmission_type.trim());
    }

    // Filter by car form (bil form)
    if (params.form && params.form.trim() !== '') {
        whereConditions.push('cl.form = ?');
        queryParams.push(params.form.trim());
    }

    // Filter by maximum payment
    if (params.payment && params.payment.trim() !== '') {
        whereConditions.push('cl.payment <= ?');
        queryParams.push(parseFloat(params.payment.trim()));
    }

    // Filter by maximum monthly payment
    if (params.month_payment && params.month_payment.trim() !== '') {
        whereConditions.push('cl.month_payment <= ?');
        queryParams.push(parseFloat(params.month_payment.trim()));
    }

    // Filter by maximum kilometer
    if (params.km_status && params.km_status.trim() !== '') {
        whereConditions.push('cl.km_status <= ?');
        queryParams.push(parseFloat(params.km_status.trim()));
    }

    // Filter by minimum discount
    if (params.discount && params.discount.trim() !== '') {
        whereConditions.push('cl.discount >= ?');
        queryParams.push(parseFloat(params.discount.trim()));
    }

    // Filter by transmission (if this is meant to be distinct from transmission_type, adjust accordingly)
    if (params.transmission && params.transmission.trim() !== '') {
        whereConditions.push('cl.transmission_type = ?');
        queryParams.push(params.transmission.trim());
    }

    // Filter by max year (model_year)
    if (params.model_year && params.model_year.trim() !== '') {
        whereConditions.push('cl.model_year <= ?');
        queryParams.push(parseInt(params.model_year.trim(), 10));
    }

    // Filter by model (this is a LIKE query for partial matches)
    if (params.model && params.model.trim() !== '') {
        whereConditions.push('cl.model LIKE ?');
        queryParams.push(`%${params.model.trim()}%`);
    }

    // Adding conditions to the baseQuery if there are any
    if (whereConditions.length) {
        baseQuery += ' WHERE ' + whereConditions.join(' AND ');
    }

    baseQuery += `
    GROUP BY cl.listing_id
    ORDER BY cl.listing_id DESC
`;

    // Pagination logic with LIMIT and OFFSET
    const limit = parseInt(params.limit, 10) || 10; // default limit is 10
    const offset = (parseInt(params.page, 10) - 1) * limit || 0; // default page is 1
    baseQuery += ' LIMIT ? OFFSET ?';
    queryParams.push(limit, offset);

    return { query: baseQuery, params: queryParams };
}


app.get('/all-listings', (req, res) => {
    const { query, params } = constructFilteredQuery(req.query);


    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Error fetching listings:', err);
            return res.status(500).send('Internal Server Error');
        }

        // Parsing the images array and handling the primary image
        const listings = results.map(listing => ({
            ...listing,
            images: listing.images ? listing.images.split(',') : [],
            primary_image: listing.primary_image || (listing.images && listing.images.split(',')[0]) || null
        }));

        res.json(listings);
    });
});

// henter modeller tilknyttet carlistings
app.get('/models-by-brand', (req, res) => {
    const brandName = req.query.brand;
    if (!brandName) {
        return res.status(400).json({ error: 'Brand name is required' });
    }

    const sql = `
        SELECT DISTINCT model
        FROM carlistings cl
        INNER JOIN carbrands cb ON cl.brand_id = cb.brand_id
        WHERE cb.brand_name = ?
    `;

    db.query(sql, [brandName], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        const models = results.map(row => row.model);
        res.json(models);
    });
});





app.get('/carlistings', (req, res) => {
    const sql = `
        SELECT cl.*, cb.brand_name, 
            GROUP_CONCAT(li.image_path) AS images,
            MAX(CASE WHEN li.is_primary = 1 THEN li.image_path ELSE NULL END) AS primary_image
        FROM carlistings cl
        LEFT JOIN carbrands cb ON cl.brand_id = cb.brand_id
        LEFT JOIN listingimages li ON cl.listing_id = li.listing_id
        GROUP BY cl.listing_id;
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching listings with brands and images:', err);
            return res.status(500).send('Internal Server Error');
        }

        // Parsing the images array and ensuring the primary image is handled correctly
        const listingsWithImagesAndBrand = results.map(listing => ({
            ...listing,
            images: listing.images ? listing.images.split(',') : [],
            primary_image: listing.primary_image || (listing.images && listing.images.split(',')[0]) || null
        }));

        res.json(listingsWithImagesAndBrand);
    });
});

// Endpoint for listings with the highest discount values
app.get('/carlistings/highest-discounts', (req, res) => {
    const sql = `
        SELECT cl.*, cb.brand_name, 
            GROUP_CONCAT(li.image_path) AS images, 
            MAX(CASE WHEN li.is_primary = 1 THEN li.image_path ELSE NULL END) AS primary_image
        FROM carlistings cl
        LEFT JOIN carbrands cb ON cl.brand_id = cb.brand_id
        LEFT JOIN listingimages li ON cl.listing_id = li.listing_id
        GROUP BY cl.listing_id
        ORDER BY cl.discount DESC
        LIMIT 4;
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        // Transform results to include an images array and a primary_image if available
        const transformedResults = results.map(listing => {
            const images = listing.images ? listing.images.split(',') : [];
            return {
                ...listing,
                images,
                primary_image: listing.primary_image || (images.length > 0 ? images[0] : null)
            };
        });
        res.json(transformedResults);
    });
});

app.get('/carlistings/newest', (req, res) => {
    const sql = `
        SELECT cl.*, cb.brand_name, 
            GROUP_CONCAT(li.image_path) AS images, 
            MAX(CASE WHEN li.is_primary = 1 THEN li.image_path ELSE NULL END) AS primary_image
        FROM carlistings cl
        LEFT JOIN carbrands cb ON cl.brand_id = cb.brand_id
        LEFT JOIN listingimages li ON cl.listing_id = li.listing_id
        GROUP BY cl.listing_id
        ORDER BY cl.listing_id DESC
        LIMIT 4;
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        // Transform results to include an images array and a primary_image if available
        const transformedResults = results.map(listing => {
            const images = listing.images ? listing.images.split(',') : [];
            return {
                ...listing,
                images,
                primary_image: listing.primary_image || (images.length > 0 ? images[0] : null)
            };
        });
        res.json(transformedResults);
    });
});

// Endpoint to fetch car types with logos
app.get('/car-types', (req, res) => {
    const sql = 'SELECT type_name, logo_path FROM car_types';

    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(results);
    });
});



app.get('/carlistings/:listingId', (req, res) => {
    const listingId = req.params.listingId;
    const listingSql = `
        SELECT cl.*, cb.brand_name, JSON_ARRAYAGG(li.image_path) AS images
        FROM carlistings cl
        LEFT JOIN carbrands cb ON cl.brand_id = cb.brand_id
        LEFT JOIN listingimages li ON cl.listing_id = li.listing_id
        WHERE cl.listing_id = ?
        GROUP BY cl.listing_id;
    `;

    db.query(listingSql, [listingId], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        if (results.length === 0) {
            res.status(404).json({ error: 'Listing not found' });
            return;
        }

        const listing = { ...results[0], images: JSON.parse(results[0].images || '[]') };

        // New query to fetch equipment
        const equipmentSql = `
            SELECT e.name
            FROM equipment e
            JOIN carlistingequipment cle ON e.equipment_id = cle.equipment_id
            WHERE cle.listing_id = ?;
        `;

        db.query(equipmentSql, [listingId], (equipErr, equipResults) => {
            if (equipErr) {
                res.status(500).json({ error: 'Error fetching equipment data' });
                return;
            }

            // Adding equipment data to the listing object
            listing.equipment = equipResults.map(equip => equip.name);

            res.json(listing);
        });
    });
});







// USER CREATION ENDPOINTS



const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs'); // Add this at the beginning where other modules are required


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({ storage: storage });


// USER CREATION ENDPOINT with File Deletion on Failure
app.post('/create-user', upload.single('profilePicture'), async (req, res) => {
    const { firstName, lastName, email, password, phone, city, facebookProfile } = req.body;
    const profilePicturePath = req.file ? req.file.path : null; // Adjusted for file path

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = `
            INSERT INTO users 
            (first_name, last_name, email, hashed_password, phone, city, facebook_profile, profile_picture_path) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        db.query(query, [firstName, lastName, email, hashedPassword, phone, city, facebookProfile, profilePicturePath], (err, results) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    // File deletion if user creation fails due to duplicate email
                    if (profilePicturePath) {
                        fs.unlink(profilePicturePath, unlinkErr => {
                            if (unlinkErr) console.error('Error deleting file:', unlinkErr);
                            else console.log('Uploaded file deleted');
                        });
                    }
                    return res.status(409).json({ message: 'Email already exists.' });
                } else {
                    console.error(err);
                    return res.status(500).json({ message: 'Error creating user' });
                }
            }

            const token = jwt.sign({ userId: results.insertId }, 'b8VP4$z7PZr^2L&3HwJ@5MkY*GvZq!9', { expiresIn: '4h' });
            res.status(201).json({ token });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Login endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = results[0];
        const match = await bcrypt.compare(password, user.hashed_password);

        if (match) {
            const token = jwt.sign({ userId: user.id }, 'b8VP4$z7PZr^2L&3HwJ@5MkY*GvZq!9', { expiresIn: '4h' });
            return res.json({ token });
        } else {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
    });
});




const checkIfAuthenticated = expressJwt({
    secret: 'b8VP4$z7PZr^2L&3HwJ@5MkY*GvZq!9', // Replace 'YOUR_SECRET_KEY' with your actual secret key
    algorithms: ['HS256'], // Ensure this matches the algorithm used to sign the token
    requestProperty: 'auth' // Optional: define the property name to store the decoded token (default is 'user')
});

app.get('/user-listings', checkIfAuthenticated, (req, res) => {
    const userId = req.auth.userId;
    const sql = `
    SELECT cl.*, li.image_path, li.is_primary
    FROM carlistings cl
    LEFT JOIN listingimages li ON cl.listing_id = li.listing_id
    WHERE cl.user_id = ?
    ORDER BY li.is_primary DESC;
    
    `;

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }

        // Process results to group images by listing and mark primary image
        const listingsWithImages = results.reduce((acc, curr) => {
            if (!acc[curr.listing_id]) {
                acc[curr.listing_id] = { ...curr, images: [], primaryImage: null };
            }
            if (curr.is_primary) {
                acc[curr.listing_id].primaryImage = curr.image_path;
            } else {
                acc[curr.listing_id].images.push(curr.image_path);
            }
            return acc;
        }, {});

        // Convert the aggregated object back into an array
        const listings = Object.values(listingsWithImages);

        res.json(listings);
    });
});

app.post('/create-listing', checkIfAuthenticated, upload.array('images'), (req, res) => {
    const userId = req.auth.userId; // Assuming user ID is correctly extracted from the auth middleware
    let {
        description, type, form, brand_id, model, model_year, fuel_type,
        transmission_type, variant, horsepower, color, service_book, km_status,
        condition_status, leasing_type, ownership_transferable = 0, instant_takeover = 1,
        payment, month_payment, lease_period, restvalue, discount, reserve_price,
        offer_validity, equipment
    } = req.body;

    // Handle equipment, ensuring it's an array
    equipment = equipment ? equipment.split(',').map(Number) : [];

    const images = req.files; // Array of images uploaded
    const primaryImage = req.body.primary; // Filename of the primary image

    // Start a transaction
    db.beginTransaction(err => {
        if (err) {
            console.error("Transaction Begin Error:", err);
            return res.status(500).send('Failed to start transaction.');
        }

        const listingSql = `
            INSERT INTO carlistings (user_id, description, type, form, brand_id, model, model_year, fuel_type,
            transmission_type, variant, horsepower, color, service_book, km_status,
            condition_status, leasing_type, ownership_transferable, instant_takeover,
            payment, month_payment, lease_period, restvalue, discount, reserve_price,
            offer_validity, be_listed) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        db.query(listingSql, [
            userId, description, type, form, brand_id, model, model_year, fuel_type,
            transmission_type, variant, horsepower, color, service_book, km_status,
            condition_status, leasing_type, ownership_transferable, instant_takeover,
            payment, month_payment, lease_period, restvalue, discount, reserve_price,
            offer_validity, 1
        ], (listingErr, listingResult) => {
            if (listingErr) {
                console.error("Insert Listing Error:", listingErr);
                return db.rollback(() => res.status(500).send('Failed to insert listing.'));
            }

            const listingId = listingResult.insertId;

            // Insert equipment if any
            if (equipment.length > 0) {
                const equipmentSql = 'INSERT INTO carlistingequipment (listing_id, equipment_id) VALUES ?';
                const equipmentValues = equipment.map(id => [listingId, id]);
                db.query(equipmentSql, [equipmentValues], equipmentErr => {
                    if (equipmentErr) {
                        console.error("Insert Equipment Error:", equipmentErr);
                        return db.rollback(() => res.status(500).send('Failed to insert equipment.'));
                    }
                });
            }

            // Handle image uploads
            if (images.length > 0) {
                const imageSql = 'INSERT INTO listingimages (listing_id, image_path, is_primary) VALUES ?';
                const imageValues = images.map(file => [
                    listingId, file.path, file.originalname === primaryImage ? 1 : 0
                ]);
                db.query(imageSql, [imageValues], imageErr => {
                    if (imageErr) {
                        console.error("Insert Image Error:", imageErr);
                        return db.rollback(() => res.status(500).send('Failed to insert images.'));
                    }

                    db.commit(commitErr => {
                        if (commitErr) {
                            console.error("Transaction Commit Error:", commitErr);
                            return db.rollback(() => res.status(500).send('Failed to commit transaction.'));
                        }
                        res.send('Listing created successfully.');
                    });
                });
            } else {
                db.commit(commitErr => {
                    if (commitErr) {
                        console.error("Transaction Commit Error:", commitErr);
                        return db.rollback(() => res.status(500).send('Failed to commit transaction.'));
                    }
                    res.send('Listing created successfully.');
                });
            }
        });
    });
});



// delete listing
app.delete('/listing/:listingId', checkIfAuthenticated, (req, res) => {
    const { listingId } = req.params;
    const userId = req.auth.userId; // Assuming you want to check if the requester is the owner

    // Start a transaction
    db.beginTransaction(async (err) => {
        if (err) {
            console.error("Transaction Begin Error:", err);
            return res.status(500).send('Failed to start transaction.');
        }

        try {
            // Fetch image paths before deletion
            const imagePaths = await new Promise((resolve, reject) => {
                db.query('SELECT image_path FROM listingimages WHERE listing_id = ?', [listingId], (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results.map(row => row.image_path));
                    }
                });
            });

            // Delete associated images from listingimages table
            await db.query('DELETE FROM listingimages WHERE listing_id = ?', [listingId]);

            // Delete the image files from the filesystem
            imagePaths.forEach(imagePath => {
                // Adjust the path construction to be dynamic
                let fullPath = path.join(__dirname, 'uploads', path.basename(imagePath));
                fs.unlink(fullPath, (err) => {
                    if (err) {
                        console.error("Error deleting image file:", err);
                    } else {
                        console.log(`Deleted image file: ${fullPath}`);
                    }
                });
            });

            // Delete associated equipment listings from carlistingequipment
            await db.query('DELETE FROM carlistingequipment WHERE listing_id = ?', [listingId]);

            // Finally, delete the listing itself from carlistings
            await db.query('DELETE FROM carlistings WHERE listing_id = ? AND user_id = ?', [listingId, userId]);

            // Commit the transaction
            db.commit((commitErr) => {
                if (commitErr) {
                    db.rollback(() => {
                        console.error("Transaction Commit Error:", commitErr);
                        res.status(500).send('Failed to commit transaction.');
                    });
                    return;
                }
                res.send('Listing and associated data deleted successfully.');
            });
        } catch (transactionError) {
            db.rollback(() => {
                console.error("Error during transaction, rolling back:", transactionError);
                res.status(500).send('Internal Server Error during transaction.');
            });
        }
    });
});




app.put('/edit-listing/:listingId', checkIfAuthenticated, async (req, res) => {
    const userId = req.auth.userId;
    const listingId = req.params.listingId;
    const {
        be_listed, description, type, form, brand_id, model, model_year, fuel_type,
        transmission_type, variant, horsepower, color, service_book, km_status,
        condition_status, leasing_type, ownership_transferable, instant_takeover,
        payment, month_payment, lease_period, restvalue, discount, reserve_price,
        offer_validity, equipment, imagesToRemove, existingPrimary
    } = req.body;

    // Start a transaction
    db.beginTransaction(async (err) => {
        if (err) {
            console.error("Transaction Begin Error:", err);
            return res.status(500).send('Failed to start transaction.');
        }

        try {
            // Update listing details
            let updateSql = `UPDATE carlistings SET be_listed = ?, description = ?, type = ?, form = ?, brand_id = ?, model = ?, model_year = ?, fuel_type = ?, transmission_type = ?, variant = ?, horsepower = ?, color = ?, service_book = ?, km_status = ?, condition_status = ?, leasing_type = ?, ownership_transferable = ?, instant_takeover = ?, payment = ?, month_payment = ?, lease_period = ?, restvalue = ?, discount = ?, reserve_price = ?, offer_validity = ? WHERE listing_id = ? AND user_id = ?`;
            await db.query(updateSql, [be_listed, description, type, form, brand_id, model, model_year, fuel_type, transmission_type, variant, horsepower, color, service_book, km_status, condition_status, leasing_type, ownership_transferable, instant_takeover, payment, month_payment, lease_period, restvalue, discount, reserve_price, offer_validity, listingId, userId]);


            // Delete existing equipment
            await db.query('DELETE FROM carlistingequipment WHERE listing_id = ?', [listingId]);

            // Insert new equipment
            if (equipment && equipment.length) {
                const insertEquipmentSql = 'INSERT INTO carlistingequipment (listing_id, equipment_id) VALUES ?';
                const equipmentValues = equipment.map(id => [listingId, id]);
                await db.query(insertEquipmentSql, [equipmentValues]);
            }


            // Handle images to remove
            if (imagesToRemove && imagesToRemove.length) {
                for (const imagePath of imagesToRemove) {
                    await db.query('DELETE FROM listingimages WHERE image_path = ? AND listing_id = ?', [imagePath, listingId]);

                    // Correct the path to account for the directory structure
                    let fullPath = path.join(__dirname, 'uploads', imagePath.split('\\').pop()); // Adjusting for Windows path
                    fs.unlink(fullPath, err => {
                        if (err) console.error("Error deleting image file:", err);
                    });
                }
            }

            // Reset and set primary image logic
            if (existingPrimary) {
                await db.query('UPDATE listingimages SET is_primary = 0 WHERE listing_id = ?', [listingId]);
                await db.query('UPDATE listingimages SET is_primary = 1 WHERE image_path = ? AND listing_id = ?', [existingPrimary, listingId]);
            }

            // Commit the transaction
            db.commit((commitErr) => {
                if (commitErr) {
                    db.rollback(() => {
                        console.error("Transaction Commit Error:", commitErr);
                        res.status(500).send('Failed to commit transaction.');
                    });
                    return;
                }
                res.send('Listing updated successfully.');
            });
        } catch (transactionError) {
            db.rollback(() => {
                console.error("Error during transaction, rolling back:", transactionError);
                res.status(500).send('Internal Server Error during transaction.');
            });
        }
    });
});



app.get('/equipment', (req, res) => {
    db.query('SELECT * FROM equipment', (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.json(results);
        }
    });
});



app.post('/upload-images/:listingId', checkIfAuthenticated, upload.array('images', 10), (req, res) => {
    const listingId = req.params.listingId;
    const primaryImageFilename = req.body.primary; // Expecting the filename of the primary image
    const existingPrimaryImagePath = req.body.existingPrimary; // Path of the existing image to be set as primary

    // Function to reset is_primary for all images of this listing
    const resetPrimaryStatus = () => {
        return new Promise((resolve, reject) => {
            const resetPrimarySql = "UPDATE listingimages SET is_primary = 0 WHERE listing_id = ?";
            db.query(resetPrimarySql, [listingId], (err, results) => {
                if (err) {
                    console.error("Error resetting is_primary:", err);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    };

    // Function to set new primary image from uploaded files
    const processUploadedFiles = () => {
        return Promise.all(req.files.map(file => {
            return new Promise((resolve, reject) => {
                const isPrimary = file.originalname === primaryImageFilename;
                const sql = "INSERT INTO listingimages (listing_id, image_path, is_primary) VALUES (?, ?, ?)";
                db.query(sql, [listingId, file.path, isPrimary ? 1 : 0], (err, results) => {
                    if (err) {
                        console.error("Error inserting image data:", err);
                        fs.unlink(file.path, (unlinkErr) => {
                            if (unlinkErr) console.error("Error deleting uploaded file:", unlinkErr);
                        });
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        }));
    };

    // Function to update an existing image to be the primary image
    const updateExistingPrimaryImage = () => {
        if (!existingPrimaryImagePath) return Promise.resolve(); // Skip if no existing image path provided
        return new Promise((resolve, reject) => {
            const updateSql = "UPDATE listingimages SET is_primary = 1 WHERE listing_id = ? AND image_path = ?";
            db.query(updateSql, [listingId, existingPrimaryImagePath], (err, results) => {
                if (err) {
                    console.error("Error updating existing primary image:", err);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    };

    resetPrimaryStatus()
        .then(() => {
            // If files are uploaded, process them
            if (req.files && req.files.length) {
                return processUploadedFiles();
            }
            return Promise.resolve();
        })
        .then(() => {
            // Update the existing primary image if specified
            return updateExistingPrimaryImage();
        })
        .then(() => {
            res.status(201).json({ message: "Image upload and primary image update successful" });
        })
        .catch(error => {
            console.error("Error during image upload and primary image update:", error);
            res.status(500).json({ message: "An error occurred." });
        });
});



app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

