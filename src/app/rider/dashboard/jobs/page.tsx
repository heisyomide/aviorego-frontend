// page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import JobCard from './components/JobsCard';
import JobDetailsModal from './components/JobDetailsModal';
import EmptyJobs from './components/EmptyJobs';
import LoadingJobs from './components/LoadingJobs';
import jobsService from './services/jobs.service';
import type { AvailableJob } from './types';

export default function JobsPage() {
  const router = useRouter();

  const [jobs, setJobs] = useState<AvailableJob[]>([]);
  const [jobType, setJobType] = useState<string>('PARCEL_DELIVERY');
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<AvailableJob | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [timer, setTimer] = useState(15);

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    try {
      const response: any = await jobsService.getAvailableJobs();
      
      const items = Array.isArray(response) 
        ? response 
        : response?.jobs || [];
        
      setJobs(items);
      if (response?.jobType) {
        setJobType(response.jobType);
      }
    } catch (error) {
      console.error('Failed to load available jobs:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!modalOpen) return;

    setTimer(15);

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setModalOpen(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [modalOpen]);

  async function acceptJob() {
    if (!selectedJob) return;

    const jobId = selectedJob.id || selectedJob.tripId;
    if (!jobId) return;

    try {
      setAccepting(true);
      await jobsService.acceptJob(jobId);
      router.push(`/rider/dashboard/jobs/${jobId}`);
    } catch (error) {
      console.error('Failed to accept job:', error);
    } finally {
      setAccepting(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Available Jobs</h1>
          <p className="text-neutral-500 mt-2">
            {jobType === 'EVENT_TRANSIT' ? 'Nearby event bus transit assignments.' : 'Nearby parcel delivery requests.'}
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-neutral-800 text-emerald-400 font-mono text-xs font-bold uppercase">
          {jobType.replaceAll('_', ' ')}
        </span>
      </div>

      {loading ? (
        <LoadingJobs />
      ) : jobs.length === 0 ? (
        <EmptyJobs />
      ) : (
        <div className="space-y-5">
          {jobs.map((job) => {
            const uniqueKey = job.id || job.tripId || Math.random().toString();
            return (
              <JobCard
                key={uniqueKey}
                job={job}
                jobType={jobType}
                onClick={() => {
                  setSelectedJob(job);
                  setModalOpen(true);
                }}
              />
            );
          })}
        </div>
      )}

      <JobDetailsModal
        open={modalOpen}
        job={selectedJob}
        jobType={jobType}
        timer={timer}
        accepting={accepting}
        onAccept={acceptJob}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}