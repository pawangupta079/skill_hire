import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { jobsAPI, applicationsAPI } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { 
  MapPin, 
  DollarSign, 
  Clock, 
  Briefcase,
  Building,
  Calendar,
  Users,
  CheckCircle
} from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const JobDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [job, setJob] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await jobsAPI.getJob(id);
      setJob(response.data.job);
      setHasApplied(response.data.hasApplied);
    } catch (error) {
      console.error('Error fetching job details:', error);
      toast.error('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to apply for jobs');
      return;
    }

    try {
      setApplying(true);
      await applicationsAPI.applyForJob({ jobId: id });
      setHasApplied(true);
      toast.success('Application submitted successfully!');
    } catch (error) {
      console.error('Error applying for job:', error);
      toast.error('Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <LoadingSpinner className="min-h-screen" />;
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Job not found</h2>
          <Link to="/jobs" className="btn btn-primary">
            Browse Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Job Header */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <div className="flex items-center text-gray-600 mb-4">
                <Building className="h-5 w-5 mr-2" />
                <span className="text-xl">{job.company?.name}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {job.salary?.min ? `$${job.salary.min.toLocaleString()}` : 'Salary not specified'}
                {job.salary?.max && ` - $${job.salary.max.toLocaleString()}`}
              </div>
              <div className="text-sm text-gray-500">
                {job.salary?.period || 'per year'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center text-gray-600">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{job.location?.city || 'Remote'}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="h-5 w-5 mr-2" />
              <span>{job.employmentType?.replace('-', ' ').toUpperCase()}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Calendar className="h-5 w-5 mr-2" />
              <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-600">
              <Users className="h-5 w-5 mr-2" />
              <span>{job.applicationCount} applications</span>
            </div>
            
            {isAuthenticated ? (
              hasApplied ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>Applied</span>
                </div>
              ) : (
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="btn btn-primary btn-lg"
                >
                  {applying ? 'Applying...' : 'Apply Now'}
                </button>
              )
            ) : (
              <Link to="/login" className="btn btn-primary btn-lg">
                Login to Apply
              </Link>
            )}
          </div>
        </div>

        {/* Job Description */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Job Description</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
          </div>
        </div>

        {/* Requirements */}
        {job.requirements && job.requirements.length > 0 && (
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Requirements</h2>
            <ul className="space-y-2">
              {job.requirements.map((requirement, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span className="text-gray-700">{requirement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Skills */}
        {job.skills && job.skills.length > 0 && (
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Benefits */}
        {job.benefits && job.benefits.length > 0 && (
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Benefits</h2>
            <ul className="space-y-2">
              {job.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Company Info */}
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">About {job.company?.name}</h2>
          {job.company?.description ? (
            <p className="text-gray-700 mb-4">{job.company.description}</p>
          ) : (
            <p className="text-gray-500 italic">No company description available</p>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {job.company?.website && (
              <div>
                <span className="font-medium text-gray-900">Website: </span>
                <a 
                  href={job.company.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-500"
                >
                  {job.company.website}
                </a>
              </div>
            )}
            {job.company?.industry && (
              <div>
                <span className="font-medium text-gray-900">Industry: </span>
                <span className="text-gray-700">{job.company.industry}</span>
              </div>
            )}
            {job.company?.size && (
              <div>
                <span className="font-medium text-gray-900">Company Size: </span>
                <span className="text-gray-700">{job.company.size}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
