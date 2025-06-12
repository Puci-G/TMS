require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Upsert: create if not exists
await User.deleteOne({ email: 'admin@test.com' });

await User.create({
  username:  'admin',
  email:     'admin@test.com',   
  password:  'admin123',
  firstName: 'Site',
  lastName:  'Admin',
  role:      'admin'
});

console.log('✔ Admin (re)created & hashed');
    console.log('✔ Admin ensured: admin@test.com / admin123');
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close();
  }
})();
