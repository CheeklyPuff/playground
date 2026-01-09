import { Link } from 'react-router-dom';

function MonsterHunter() {
  return (
    <div className="min-h-screen bg-(--color-background) text-(--color-text) p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-(--color-primary) mb-6">
          Monster Hunter Items
        </h1>
        
        <div className="bg-white/50 rounded-lg p-6 shadow-md mb-6">
          <p className="text-lg mb-4">
            Welcome to the Monster Hunter items section. This page will display various Monster Hunter items and equipment.
          </p>
          <p className="text-(--color-secondary) font-semibold">
            Coming soon: Item listings, equipment details, and more!
          </p>
        </div>

        <Link 
          to="/" 
          className="inline-block px-6 py-3 border-2 border-solid border-(--color-primary) text-(--color-primary) rounded-lg hover:opacity-90 transition-opacity"
        >
          ← Back
        </Link>
      </div>
    </div>
  );
}

export default MonsterHunter;
