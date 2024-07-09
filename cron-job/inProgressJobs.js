const cron = require('node-cron');
const axios = require('axios');
const fs = require ('fs');

require('dotenv').config();

const runScript = async () => {
    const response = await axios.get(`${process.env.HUME_AI_JOB_URL}?status=IN_PROGRESS`, {
        headers: {
            'X-Hume-Api-Key': process.env.HUME_API_KEY
        }
    });

    if(response?.data) {
        fs.writeFile('jobs.txt', JSON.stringify(response?.data), err => {
            if (err) {
              console.error(err);
            } else {
              console.log('file written');
            }
        });
    }
}


cron.schedule('*/30 * * * * *', () => { // * * * * * every minute
    runScript();
});

