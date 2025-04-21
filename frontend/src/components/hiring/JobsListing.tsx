
import JobCard from "./JobCard";
import JobListHeader from "./JobListHeader";

interface JobListingProps {
  jobs: Array<{
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
  }>;
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
