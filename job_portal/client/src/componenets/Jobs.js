import React, { useState } from 'react';
//import './Jobs.css';

const Jobs = () => {
  // Define the mock job data
  const mockJobs = [
    { id: 1, title: 'Software Engineer', company: 'TechCorp', location: 'New York, NY', status: 'Pending' },
    { id: 2, title: 'Product Manager', company: 'Innovate Ltd.', location: 'San Francisco, CA', status: 'Interview Scheduled' },
    { id: 3, title: 'Data Scientist', company: 'DataGen', location: 'Austin, TX', status: 'Application Rejected' },
  ];

  // Initialize the state with the mock job data
  const [jobs, setJobs] = useState(mockJobs);
  const [jobStatus, setJobStatus] = useState({});

  const checkStatus = (id, status) => {
    setJobStatus((prevStatus) => ({ ...prevStatus, [id]: status }));
  };

  return (
    <div className="jobs-container">
      <h2>Available Jobs</h2>
      <div className="jobs-list">
        {jobs.map((job) => (
          <div key={job.id} className="job-card">
            <h3>{job.title}</h3>
            <p>{job.company}</p>
            <p>{job.location}</p>
            <button onClick={() => checkStatus(job.id, job.status)}>
              Check Application Status
            </button>
            {/* Show the status below the button */}
            {jobStatus[job.id] && (
              <p className="status">Application Status: {jobStatus[job.id]}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Jobs;
