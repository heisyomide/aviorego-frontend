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

  const [jobs, setJobs] =
    useState<AvailableJob[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [selectedJob, setSelectedJob] =
    useState<AvailableJob | null>(null);

  const [modalOpen, setModalOpen] =
    useState(false);

  const [accepting, setAccepting] =
    useState(false);

  const [timer, setTimer] =
    useState(15);

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    try {
      const response =
        await jobsService.getAvailableJobs();

      setJobs(response);
    } catch (error) {
      console.error(error);
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

    try {
      setAccepting(true);

      await jobsService.acceptJob(
        selectedJob.id,
      );

      router.push(
        `/rider/dashboard/jobs/${selectedJob.id}`,
      );

    } catch (error) {
      console.error(error);
    } finally {
      setAccepting(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">

      <div className="mb-10">

        <h1 className="text-3xl font-black text-white">
          Available Jobs
        </h1>

        <p className="text-neutral-500 mt-2">
          Nearby delivery requests.
        </p>

      </div>

      {loading ? (

        <LoadingJobs />

      ) : jobs.length === 0 ? (

        <EmptyJobs />

      ) : (

        <div className="space-y-5">

          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onClick={() => {
                setSelectedJob(job);
                setModalOpen(true);
              }}
            />
          ))}

        </div>

      )}

      <JobDetailsModal
        open={modalOpen}
        job={selectedJob}
        timer={timer}
        accepting={accepting}
        onAccept={acceptJob}
        onClose={() => setModalOpen(false)}
      />

    </div>
  );
}