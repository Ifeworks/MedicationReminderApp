import app from './app';
import dotenv from 'dotenv';
import path from 'path';
import { supabase } from './config/supabase';

// Explicitly point to the .env file in the root backend folder
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, '0.0.0.0', async () => {
    console.log(`🚀 PB DELICACIES Backend running on http://127.0.0.1:${PORT} (bound to 0.0.0.0)`);
    
    // Database Health Check on Startup
    try {
        const { error } = await supabase.from('categories').select('id').limit(1);
        if (error) {
            console.error(`❌ Database Connection Error: ${error.message}`);
        } else {
            console.log('✅ Supabase Database Connected Successfully! (PB DELICACIES)');
        }
    } catch (err: any) {
        console.error(`❌ Failed to connect to Database: ${err.message}`);
    }
});