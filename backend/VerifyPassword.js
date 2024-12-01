
const bcrypt = require('bcryptjs');

const verifyPassword = async () => {
    const plainPassword = 'password123'; // Replace with the original signup password
    const hashedPassword = '$2a$10$V1nY6eZvN6QwMB8JKWTVheRI12YJmRy/mkVqPz6mZjHZs95ElgM9y'; // Replace with MongoDB value

    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    console.log('Password Match:', isMatch); // Should print true if the password matches
};

verifyPassword();
