import { defineConfig } from 'cypress';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
    e2e: {
        // defaultCommandTimeout: 60000,
    },
    env: {
        API_TOKEN: process.env.API_TOKEN,
    },
});
