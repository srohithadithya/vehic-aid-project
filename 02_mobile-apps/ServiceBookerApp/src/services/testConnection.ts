// Test API connectivity
import axios from 'axios';

// Test backend connection
const BASE_URL = 'http://10.0.2.2:8000/api/v1/';

async function testBackendConnection() {
    try {
        console.log('Testing backend connection...');
        const response = await axios.get(`${BASE_URL}users/`);
        console.log('✅ Backend connected successfully!');
        console.log('Response:', response.data);
        return true;
    } catch (error) {
        console.error('❌ Backend connection failed:', error.message);
        return false;
    }
}

testBackendConnection();

export default testBackendConnection;
