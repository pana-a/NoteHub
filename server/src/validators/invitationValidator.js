const { body } = require('express-validator')

const invitationValidation = [
  body('toEmail')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail()
    .custom((value) => {
      if (!value.endsWith('@ase.ro')) {
        throw new Error('Only BUES students are allowed to receive invitations')
      }
      return true
    })
]

module.exports = { invitationValidation }
