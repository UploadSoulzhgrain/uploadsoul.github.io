
import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Use environment variable or fallback for now (though fallback is not safe for prod)
    // The key found in backend-simulator.js was hardcoded.
    // Ideally user sets HEYGEN_API_KEY in Vercel.
    const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY || 'sk_V2_hgu_kUJuwlf4dLH_ljzwKlF1jsoS7UPRqkPLPmSj3fX2wG34';

    try {
        const response = await axios.post('https://api.heygen.com/v1/streaming.create_token', null, {
            headers: {
                'x-api-key': HEYGEN_API_KEY
            }
        });
        res.status(200).json({ token: response.data.data.token });
    } catch (err) {
        console.error('HeyGen Token Error:', err.response?.data || err.message);
        res.status(500).json({ error: 'Failed to fetch HeyGen token' });
    }
}
