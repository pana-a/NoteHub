const express = require('express')
const router = express.Router()

const {
  listMyInvitations,
  acceptInvitation,
  declineInvitation
} = require('../controllers/invitations')

const { validateToken } = require('../middleware/auth')

router.get('/', validateToken, listMyInvitations)
router.post('/:id/accept', validateToken, acceptInvitation)
router.post('/:id/decline', validateToken, declineInvitation)

module.exports = router
