import { Link } from 'react-router-dom';
import { 
  Search, 
  Briefcase, 
  Users, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  Star,
  TrendingUp
} from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <Search className="h-8 w-8 text-primary-600" />,
      title: "Smart Job Matching",
      description: "AI-powered algorithm matches you with the perfect job opportunities based on your skills and preferences."
    },
    {
      icon: <Users className="h-8 w-8 text-primary-600" />,
      title: "Connect with Recruiters",
      description: "Build meaningful relationships with recruiters and hiring managers through our integrated messaging system."
    },
    {
      icon: <Zap className="h-8 w-8 text-primary-600" />,
      title: "Instant Applications",
      description: "Apply to multiple jobs with one click using your comprehensive profile and resume."
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Jobs" },
    { number: "50K+", label: "Job Seekers" },
    { number: "5K+", label: "Companies" },
    { number: "95%", label: "Success Rate" }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer",
      company: "TechCorp",
      content: "SkillHire helped me find my dream job in just 2 weeks! The AI matching is incredible.",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Product Manager",
      company: "StartupXYZ",
      content: "The platform made it so easy to connect with the right companies. Highly recommended!",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "UX Designer",
      company: "DesignStudio",
      content: "I love how SkillHire understands my career goals and matches me with relevant opportunities.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Dream Job with
              <span className="block text-yellow-300">AI-Powered Matching</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Connect with top companies and discover opportunities that match your skills, 
              experience, and career aspirations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-yellow-400 text-primary-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-300 transition-colors inline-flex items-center justify-center"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/jobs"
                className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors inline-flex items-center justify-center"
              >
                Browse Jobs
                <Search className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose SkillHire?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We use cutting-edge technology to revolutionize the job search experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in just a few simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Create Your Profile
              </h3>
              <p className="text-gray-600">
                Sign up and build a comprehensive profile showcasing your skills, experience, and career goals.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Get Matched
              </h3>
              <p className="text-gray-600">
                Our AI analyzes your profile and matches you with relevant job opportunities from top companies.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Land Your Dream Job
              </h3>
              <p className="text-gray-600">
                Apply to matched jobs, connect with recruiters, and secure your next career opportunity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of professionals who found their dream jobs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Next Opportunity?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Join SkillHire today and discover jobs that match your skills and aspirations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-yellow-400 text-primary-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-300 transition-colors inline-flex items-center justify-center"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/jobs"
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors inline-flex items-center justify-center"
            >
              Explore Jobs
              <TrendingUp className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
