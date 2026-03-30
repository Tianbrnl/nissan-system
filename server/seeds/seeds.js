import Users from '../models/User.js';
import bcrypt from 'bcrypt';

const seeds = async () => {
    try {
        console.log('🌱 Seeding default account...');

        // Seed default admin if not exists
        const existingUser = await Users.findOne({ where: { email: 'admin@nissan.com' } });
        if (!existingUser) {
            const hashedPassword = await bcrypt.hash('Admin@12345', 10);
            await Users.create({
                email: 'admin@nissan.com',
                password: hashedPassword
            });
        } else {
            console.log('✅ Admin already exists');
        }

        console.log('🎉 Seeding completed successfully!');

    } catch (error) {
        console.error('❌ Error seeding data:', error.message);
    }
};

export default seeds;
