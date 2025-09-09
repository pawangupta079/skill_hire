import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobsAPI } from '../utils/api';
import { 
  Search, 
  MapPin, 
  DollarSign, 
  Clock, 
  Briefcase,
  Filter,
  SortAsc
} from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [filters, setFilters] = useState({
    employmentType: '',
    experienceLevel: '',
    minSalary: '',
    maxSalary: ''
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobsAPI.getJobs({
        search: searchTerm,
        location,
        ...filters
      });
      setJobs(response.data.jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const formatSalary = (job) => {
    if (!job.salary?.min && !job.salary?.max) return 'Salary not specified';
    
    const formatNumber = (num) => {
      if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
      if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`;
      return `$${num}`;
    };
    
    if (job.salary.min && job.salary.max) {
      return `${formatNumber(job.salary.min)} - ${formatNumber(job.salary.max)}`;
    } else if (job.salary.min) {
      return `${formatNumber(job.salary.min)}+`;
    } else if (job.salary.max) {
      return `Up to ${formatNumber(job.salary.max)}`;
    }
    
    return 'Salary not specified';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Your Next Job</h1>
          <p className="text-gray-600">Discover opportunities that match your skills and career goals</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="City, state, or remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                value={filters.employmentType}
                onChange={(e) => setFilters({...filters, employmentType: e.target.value})}
                className="input"
              >
                <option value="">Employment Type</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="freelance">Freelance</option>
              </select>

              <select
                value={filters.experienceLevel}
                onChange={(e) => setFilters({...filters, experienceLevel: e.target.value})}
                className="input"
              >
                <option value="">Experience Level</option>
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
                <option value="executive">Executive</option>
              </select>

              <input
                type="number"
                placeholder="Min Salary"
                value={filters.minSalary}
                onChange={(e) => setFilters({...filters, minSalary: e.target.value})}
                className="input"
              />

              <input
                type="number"
                placeholder="Max Salary"
                value={filters.maxSalary}
                onChange={(e) => setFilters({...filters, maxSalary: e.target.value})}
                className="input"
              />
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setLocation('');
                  setFilters({
                    employmentType: '',
                    experienceLevel: '',
                    minSalary: '',
                    maxSalary: ''
                  });
                  fetchJobs();
                }}
                className="btn btn-outline"
              >
                Clear Filters
              </button>
              <button type="submit" className="btn btn-primary">
                Search Jobs
              </button>
            </div>
          </form>
        </div>

        {/* Jobs List */}
        {loading ? (
          <LoadingSpinner className="min-h-64" />
        ) : (
          <div className="space-y-6">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <div key={job._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-xl font-semibold text-gray-900 mr-3">
                            {job.title}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            job.employmentType === 'full-time' ? 'bg-green-100 text-green-800' :
                            job.employmentType === 'part-time' ? 'bg-blue-100 text-blue-800' :
                            job.employmentType === 'contract' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {job.employmentType?.replace('-', ' ').toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-gray-600 mb-3">
                          <Briefcase className="h-4 w-4 mr-2" />
                          <span className="mr-4">{job.company?.name}</span>
                          <MapPin className="h-4 w-4 mr-2" />
                          <span className="mr-4">{job.location?.city || 'Remote'}</span>
                          <DollarSign className="h-4 w-4 mr-2" />
                          <span>{formatSalary(job)}</span>
                        </div>

                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {job.description.substring(0, 200)}...
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {new Date(job.createdAt).toLocaleDateString()}
                            </span>
                            <span>{job.applicationCount} applications</span>
                          </div>
                          
                          <Link
                            to={`/jobs/${job._id}`}
                            className="btn btn-primary"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-500">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
