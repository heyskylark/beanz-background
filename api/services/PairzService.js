import axios from 'axios';
import { BadRequest } from '../errors/HttpErrors.js';

const BEANZ_MAX_ID = 19950;
const AZUKI_MAX_ID = 10000;

export async function generatePairsImage(azukiId, beanzId) {
    validatePairsRequest(azukiId, beanzId);

    const pairsUrl = createPairsUrl(azukiId, beanzId);

    const response = await axios.get(pairsUrl, {
        responseType: 'arraybuffer'
    });
    return response.data
}

function validatePairsRequest(azukiId, beanzId) {
    if (!azukiId) {
        throw new BadRequest("Azuki Id must be present", 400);
    } else if (!beanzId) {
        throw new BadRequest("Beanz Id must be present", 400);
    }

    if (azukiId < 0 || azukiId >= AZUKI_MAX_ID) {
        throw new BadRequest("Auzki Id must be between 0 and 9,999", 400);
    } else if (beanzId < 0 || beanzId >= BEANZ_MAX_ID) {
        throw new BadRequest("Beanz Id must be between 0 and 19,949", 400);
    }
}

function createPairsUrl(azukiId, beanzId) {
    return `https://azukiimagemaker.vercel.app/api/pairbeanz-prod?azukiId=${azukiId}&beanzId=${beanzId}`;
}
