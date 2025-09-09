import { useState, useEffect } from 'react';
import { applicationsAPI } from '../utils/api';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle,
  Calendar,
  MapPin,
  DollarSign
} from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchApplications();
  }, [filter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await applicationsAPI.getMyApplications(params);
      setApplications(response.data.applications);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'shortlisted':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'shortlisted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'interviewed':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Applications</h1>
          <p className="text-gray-600">Track your job applications and their status</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All Applications' },
              { key: 'pending', label: 'Pending' },
              { key: 'shortlisted', label: 'Shortlisted' },
              { key: 'interviewed', label: 'Interviewed' },
              { key: 'rejected', label: 'Rejected' },
              { key: 'accepted', label: 'Accepted' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === tab.key
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Applications List */}
        {loading ? (
          <LoadingSpinner className="min-h-64" />
        ) : (
          <div className="space-y-6">
            {applications.length > 0 ? (
              applications.map((application) => (
                <div key={application._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-xl font-semibold text-gray-900 mr-3">
                            {application.job?.title}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(application.status)}`}>
                            {application.status}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-gray-600 mb-3">
                          <span className="mr-4">{application.job?.company?.name}</span>
                          {application.job?.location?.city && (
                            <>
                              <MapPin className="h-4 w-4 mr-1" />
                              <span className="mr-4">{application.job.location.city}</span>
                            </>
                          )}
                          {application.job?.salary?.min && (
                            <>
                              <DollarSign className="h-4 w-4 mr-1" />
                              <span>${application.job.salary.min.toLocaleString()}</span>
                            </>
                          )}
                        </div>

                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Applied on {new Date(application.createdAt).toLocaleDateString()}</span>
                        </div>

                        {application.coverLetter && (
                          <div className="mb-4">
                            <h4 className="font-medium text-gray-900 mb-2">Cover Letter:</h4>
                            <p className="text-gray-700 text-sm line-clamp-2">
                              {application.coverLetter}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-500">
                            {getStatusIcon(application.status)}
                            <span className="ml-2">
                              {application.status === 'pending' && 'Application under review'}
                              {application.status === 'shortlisted' && 'You have been shortlisted'}
                              {application.status === 'interviewed' && 'Interview completed'}
                              {application.status === 'rejected' && 'Application not selected'}
                              {application.status === 'accepted' && 'Congratulations! You got the job'}
                            </span>
                          </div>
                          
                          <div className="text-sm text-gray-500">
                            {application.daysSinceApplication} days ago
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
                <p className="text-gray-500">
                  {filter === 'all' 
                    ? "You haven't applied to any jobs yet"
                    : `No applications with status "${filter}"`
                  }
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;
