import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { applicationsAPI } from '../utils/api';
import { 
  Briefcase, 
  FileText, 
  MessageSquare, 
  TrendingUp, 
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Eye,
  Clock
} from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentApplications, setRecentApplications] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, applicationsResponse] = await Promise.all([
          applicationsAPI.getDashboardStats(),
          applicationsAPI.getMyApplications({ limit: 5 })
        ]);

        setStats(statsResponse.data.stats);
        setRecentApplications(applicationsResponse.data.applications);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner className="min-h-screen" />;
  }

  const isRecruiter = user?.userType === 'recruiter';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600 mt-2">
            {isRecruiter 
              ? 'Manage your job postings and review applications'
              : 'Track your job applications and discover new opportunities'
            }
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {isRecruiter ? 'Total Applications' : 'My Applications'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalApplications || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.pendingApplications || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Shortlisted</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.shortlistedApplications || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {isRecruiter ? 'Total Jobs' : 'Interviews'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {isRecruiter ? (stats.totalJobs || 0) : (stats.interviewedApplications || 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Applications */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {isRecruiter ? 'Recent Applications' : 'My Recent Applications'}
              </h2>
            </div>
            <div className="p-6">
              {recentApplications.length > 0 ? (
                <div className="space-y-4">
                  {recentApplications.map((application) => (
                    <div key={application._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {application.job?.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {application.job?.company?.name}
                        </p>
                        <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {application.job?.location?.city}
                          </span>
                          <span className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {application.job?.salary?.min ? 
                              `$${application.job.salary.min} - $${application.job.salary.max}` : 
                              'Salary not specified'
                            }
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          application.status === 'shortlisted' ? 'bg-green-100 text-green-800' :
                          application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {application.status}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(application.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {isRecruiter ? 'No applications yet' : 'No applications yet'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-4">
                <a
                  href="/jobs"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Briefcase className="h-6 w-6 text-primary-600 mr-4" />
                  <div>
                    <h3 className="font-medium text-gray-900">Browse Jobs</h3>
                    <p className="text-sm text-gray-600">Discover new opportunities</p>
                  </div>
                </a>

                <a
                  href="/profile"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FileText className="h-6 w-6 text-primary-600 mr-4" />
                  <div>
                    <h3 className="font-medium text-gray-900">Update Profile</h3>
                    <p className="text-sm text-gray-600">Keep your profile current</p>
                  </div>
                </a>

                <a
                  href="/chat"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <MessageSquare className="h-6 w-6 text-primary-600 mr-4" />
                  <div>
                    <h3 className="font-medium text-gray-900">Messages</h3>
                    <p className="text-sm text-gray-600">Connect with recruiters</p>
                  </div>
                </a>

                {isRecruiter && (
                  <a
                    href="/jobs/new"
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Briefcase className="h-6 w-6 text-primary-600 mr-4" />
                    <div>
                      <h3 className="font-medium text-gray-900">Post New Job</h3>
                      <p className="text-sm text-gray-600">Create a job listing</p>
                    </div>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
