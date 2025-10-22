import SNS from "../common/sns";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="flex flex-col gap-2 w-full h-full bg-black">
      <div className="w-full max-w-7xl h-full mx-auto p-6 flex justify-between text-gray-300">
        <Link href="/" className="w-full">
          <Image src="/logo/logo_dark.svg" alt="logo" width={450} height={300} />
        </Link>
        <div className="w-full flex flex-col md:flex-row justify-between gap-1">
          <div className="hidden md:block border-l-1 border-gray-800 pb-4 pl-4">
            <h1 className="text-xl font-bold mb-5 text-white">CATEGORY</h1>
            {/* TODO: <Link> を使用して、各リンク先を設定 */}
            <ul className="text-sm">
              <li className="tracking-wide mb-3">
                <a href="#">グローブ</a>
              </li>
              <li className="tracking-wide mb-3">
                <a href="#">ミット</a>
              </li>
              <li className="tracking-wide mb-3">
                <a href="#">プロテクター</a>
              </li>
              <li className="tracking-wide mb-3">
                <a href="#">サポーター</a>
              </li>
            </ul>
          </div>
          <div className="hidden md:block border-l-1 border-gray-800 pb-4 pl-4">
            <h1 className="text-xl font-bold mb-5 text-white">MENU</h1>
            <ul className="text-sm">
              <li className="tracking-wide mb-3">
                <a href="#">商品を探す</a>
              </li>
              <li className="tracking-wide mb-3">
                <a href="#">ご利用ガイド</a>
              </li>
              <li className="tracking-wide mb-3">
                <a href="#">送料ガイド</a>
              </li>
              <li className="tracking-wide mb-3">
                <a href="#">ABOUT</a>
              </li>
              <li className="tracking-wide mb-3">
                <a href="#">お問い合わせ</a>
              </li>
            </ul>
          </div>
          <div className="border-l-1 border-gray-800 pb-4 pl-4">
            <h1 className="text-xl font-bold mb-5 text-white">CONTACT US</h1>
            <ul className="text-sm">
              <li className="tracking-wide mb-3">
                <h2 className="font-bold">Address</h2>
                <p>〒160-0023　東京都新宿区西新宿1-7-3</p>
              </li>
              <li className="tracking-wide mb-3">
                <h2 className="font-bold">Phone</h2>
                <p>070-777-8888</p>
              </li>
              <li className="tracking-wide mb-3">
                <h2 className="font-bold">Email</h2>
                <p>info@bushi-gear.com</p>
              </li>
              <li className="tracking-wide mb-3">
                <h2 className="font-bold">Business Hours</h2>
                <p>9:00 - 18:00 (月〜金)</p>
                <p>土日祝休み</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="w-full max-w-7xl h-full mx-auto">
        <SNS className="text-white" />
      </div>
      <div className="w-full mx-auto mb-6">
        <h4 className="text-center font-bold text-white">BUSHIGEAR</h4>
        <h6 className="text-center text-xs text-white">COPYRIGHT © 2025</h6>
      </div>
    </footer>
  );
}
