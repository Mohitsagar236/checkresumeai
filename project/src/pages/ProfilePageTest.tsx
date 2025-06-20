import { useAuth } from '../hooks/useAuth';
import { SubscriptionInfo } from '../components/premium';

export function ProfilePageTest() {
  const { user, isLoading } = useAuth();

  console.log('ProfilePageTest rendered, user:', user);
  console.log('isLoading:', isLoading);

  if (isLoading) {
    console.log('ProfilePageTest: showing loading spinner');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    console.log('ProfilePageTest: no user, returning null');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>No user found - please log in</div>
      </div>
    );
  }

  console.log('ProfilePageTest: about to render main content');

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Profile Page Test
            </h1>
            <p className="text-lg text-gray-600">
              User: {user?.email}
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg mb-8">
            <h2 className="text-2xl font-bold mb-4">Basic Info</h2>
            <p className="mb-2"><strong>Email:</strong> {user.email}</p>
            <p className="mb-2"><strong>Name:</strong> {user.user_metadata?.full_name || 'Not set'}</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Subscription Info</h2>
            <SubscriptionInfo />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePageTest;
