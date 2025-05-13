const config = require('./utils/config')
const app = require('./app')
const cron = require('node-cron');
const axios = require('axios');

app.listen(config.PORT, () => {
  console.log('server has started')
})

//5 second testing string */5 * * * * *
//Normal string 1 0 * * *
cron.schedule('1 0 * * *', async () => {
  try {
    console.log('Running inactive user email task at 12:01 AM');
    await axios.get('http://localhost:3000/api/users/inactive'); // or your full production URL
  } catch (err) {
    console.error('Failed to trigger inactive user route:', err.message);
  }
});
