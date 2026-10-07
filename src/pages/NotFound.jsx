import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="px-6 py-20 max-w-read mx-auto">
      <h1 className="font-serif text-3xl font-semibold">This page doesn't exist</h1>
      <p className="mt-3 font-serif text-lg text-ink-soft dark:text-ink-darksoft">The topic may have been renamed. Pick a topic from the sidebar or search for it.</p>
      <Link to="/" className="inline-block mt-6 text-pen dark:text-pen-dark underline">Go to the home page</Link>
    </div>
  );
}
