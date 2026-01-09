import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-screen bg-(--color-background) text-(--color-text) flex items-center justify-center p-8">
      <div className="max-w-md text-center">
        <h1 className="text-6xl font-bold text-(--color-primary) mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-lg mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link 
          to="/" 
          className="inline-block bg-(--color-primary) text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
