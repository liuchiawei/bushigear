export default function Footer() {
  return (
    <footer className="flex flex-col w-full h-full bg-gray-200">
      <div className="w-full max-w-7xl h-full mx-auto p-6 flex flex-col md:flex-row justify-between">
        <h1 className="text-2xl font-bold text-center">LOGO</h1>
        <div>
          <h1 className="text-2xl font-bold mb-4">Category</h1>
          <ul>
            <li>グローブ</li>
            <li>ミット</li>
            <li>プロテクター</li>
            <li>サポーター</li>
          </ul>
        </div>
        <div>
          <h1 className="text-2xl font-bold">Menu</h1>
        </div>
        <div>
          <h1 className="text-2xl font-bold">Contact Us</h1>
        </div>
      </div>
      <div className="w-full max-w-7xl h-full mx-auto p-6">
        <h1 className="text-2xl font-bold text-center">SNS エリア</h1>
      </div>
      <h6 className="text-center text-sm">Copyright © 2025</h6>
    </footer>
  );
}