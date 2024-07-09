const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    jobId: String,
    status: Object,
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

const Job = mongoose.model('Job', JobSchema);

module.exports = Job;