import express from 'express';

import { 
  getAllTag, 
  getAllVagnstyper, 
  getAllVagnar, 
  getTagVagnar, 
  getTagStation, 
  createTag 
} from '../controllers/tagController.js';

const router = express.Router();

router.get('/', getAllTag);
router.get('/vagnstyp', getAllVagnstyper);
router.get('/vagnar/antal', getTagVagnar);
router.get('/vagnar', getAllVagnar);
router.get('/:station', getTagStation);
router.post('/', createTag);

export default router;
