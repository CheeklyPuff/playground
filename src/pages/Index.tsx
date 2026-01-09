import { Link } from 'react-router-dom';

function Index() {
  return (
    <div className="min-h-screen bg-(--color-background) text-(--color-text) p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-(--color-primary) mb-8">
          Welcome
        </h1>
        
        <nav>
          <ul className="space-y-4">
            <li>
              <Link 
                to="/bin"
                className="block p-4 rounded-lg bg-(--color-secondary) text-white hover:opacity-90 transition-opacity"
              >
                Which Bin?
              </Link>
            </li>
            <li>
              <Link 
                to="/mhitems"
                className="block p-4 rounded-lg bg-(--color-secondary) text-white hover:opacity-90 transition-opacity"
              >
                Monster Hunter
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Index;
