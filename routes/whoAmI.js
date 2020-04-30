const express = require('express');
const {
  whoAmI
} = require('../controllers/whoAmI');

const User = require('../models/User');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');


// All routes in this file will use protect and authorize middleware
router.use(protect);
router.use(authorize('admin'));

router
  .route("/:id")
    .get(whoAmI);

module.exports = router;
