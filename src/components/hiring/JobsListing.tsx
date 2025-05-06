import JobCard from "./JobCard";
import JobListHeader from "./JobListHeader";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  duration: string;
  budget: string;
  posted: string;
  description: string;
  skills: string[];
  applicants: number;
}

interface JobListingProps {
  jobs: Job[];
}

const JobsListing = ({ jobs }: JobListingProps) => {
  return (
    <div className="flex-1">
      <JobListHeader jobCount={jobs.length} />
      
      <div className="space-y-4">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
};

export default JobsListing;
