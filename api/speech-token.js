export default async function handler(req, res) {
    const speechKey = process.env.AZURE_SPEECH_KEY;
    const speechRegion = process.env.AZURE_SPEECH_REGION;

    if (!speechKey || !speechRegion) {
        return res.status(500).json({ error: 'Azure Speech credentials are not configured' });
    }

    const fetchOptions = {
        method: 'POST',
        headers: {
            'Ocp-Apim-Subscription-Key': speechKey,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    try {
        const response = await fetch(`https://${speechRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`, fetchOptions);
        if (!response.ok) {
            throw new Error(`Failed to fetch token: ${response.statusText}`);
        }
        const token = await response.text();
        res.status(200).json({ token, region: speechRegion });
    } catch (error) {
        console.error('Error fetching speech token:', error);
        res.status(500).json({ error: 'Failed to fetch speech token' });
    }
}
