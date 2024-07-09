const axios = require('axios');
const fs = require ('fs');
const Job = require('../models/job');


const uploadFileInHumeAI = async (req, res) => {
    try {
        const filePath = req.file.path;
        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath));
    
        const humeRes = await axios.post(process.env.HUME_AI_JOB_URL, formData , {
            headers: {
                'X-Hume-Api-Key': process.env.HUME_API_KEY, 
                'Content-Type': 'multipart/form-data'
            }
        });
    
        const jobId = humeRes.data.job_id;
        const job = new Job({jobId});
        await job.save();
    
        res.status(201).json({message: `Job Created: ${jobId}`});
    
        const interval = setInterval(async () => {
            try {
                const statusRes = await axios.get(`${process.env.HUME_AI_JOB_URL}/${jobId}`, {
                    headers: {
                        'X-Hume-Api-Key': process.env.HUME_API_KEY,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                const status = statusRes.data.state;
                await Job.updateOne({ jobId }, {
                    status,
                    updatedAt: new Date()
                });
    
                console.log('checking status', status)
    
                if(status.status === 'COMPLETED' || status.status === 'FAILED') {
                    clearInterval(interval);
                    console.log(`Job ${jobId} completed`);
                }
                
            } catch (statueError) {
                console.log('statusErr', statueError);
            }
        }, 5000);
        
     } catch (error) {
        console.log('err', error);
     }
}

module.exports = uploadFileInHumeAI;