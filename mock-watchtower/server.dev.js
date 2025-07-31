const express = require('express')

const app = express()
const PORT = 8080
const EXPECTED_TOKEN = process.env.WATCHTOWER_HTTP_API_TOKEN

if (!EXPECTED_TOKEN) {
  console.error('FATAL: WATCHTOWER_HTTP_API_TOKEN is missing.')
  process.exit(1)
}

app.post('/v1/update', (req, res) => {
  console.log('Mock Watchtower: Update request received.')
  const authHeader = req.headers['authorization']
  if (!authHeader || authHeader.split(' ')[1] !== EXPECTED_TOKEN) {
    console.error('Mock Watchtower: Invalid or missing token.')
    return res.status(401).send('Unauthorized')
  }
  console.log('✅ Mock Watchtower: Success! Token is valid.')
  res.status(200).json({ message: 'Mock update triggered!' })
})

app.listen(PORT, () => console.log(`Mock Watchtower listening on port ${PORT}`))