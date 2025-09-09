import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Phone, MapPin, Briefcase, GraduationCap, FileText } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn btn-primary"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Picture & Basic Info */}
            <div className="lg:col-span-1">
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <User className="h-16 w-16 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-gray-600">{user?.userType?.charAt(0).toUpperCase() + user?.userType?.slice(1)}</p>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-700">{user?.email}</span>
                </div>
                {user?.profile?.phone && (
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-700">{user.profile.phone}</span>
                  </div>
                )}
                {user?.profile?.location && (
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-700">{user.profile.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Detailed Information */}
            <div className="lg:col-span-2 space-y-8">
              {/* Bio */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
                <p className="text-gray-700">
                  {user?.profile?.bio || 'No bio available'}
                </p>
              </div>

              {/* Skills */}
              {user?.profile?.skills && user.profile.skills.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.profile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience */}
              {user?.profile?.experience && user.profile.experience.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Experience</h3>
                  <div className="space-y-4">
                    {user.profile.experience.map((exp, index) => (
                      <div key={index} className="border-l-4 border-primary-500 pl-4">
                        <h4 className="font-medium text-gray-900">{exp.position}</h4>
                        <p className="text-gray-600">{exp.company}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(exp.startDate).toLocaleDateString()} - {exp.current ? 'Present' : new Date(exp.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {user?.profile?.education && user.profile.education.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Education</h3>
                  <div className="space-y-4">
                    {user.profile.education.map((edu, index) => (
                      <div key={index} className="border-l-4 border-primary-500 pl-4">
                        <h4 className="font-medium text-gray-900">{edu.degree}</h4>
                        <p className="text-gray-600">{edu.institution}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(edu.startDate).toLocaleDateString()} - {edu.current ? 'Present' : new Date(edu.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Resume */}
              {user?.profile?.resume && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Resume</h3>
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <FileText className="h-8 w-8 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">{user.profile.resume.originalName}</p>
                      <p className="text-sm text-gray-500">
                        Uploaded {new Date(user.profile.resume.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
