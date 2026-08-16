export default function Footer() {
  return (
    <footer className="bg-neutral-900 border-t border-neutral-800 text-neutral-500 py-6 text-center text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        © {new Date().getFullYear()} StayEase. All rights reserved.
      </div>
    </footer>
  );
}
