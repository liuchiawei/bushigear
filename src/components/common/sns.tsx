import { Instagram } from "lucide-react";
import { Facebook } from "lucide-react";
import { X } from "lucide-react";

export default function SNS() {
  return (
    <div className="flex flex-row justify-center items-center space-x-4">
      <ul className="flex flex-row [&_li]:gap-6 [&_li]:cursor-pointer ">
        <li>
          <a href="https://www.instagram.com/">
            <Instagram />
          </a>
        </li>
        <li>
          <a href="https://www.facebook.com/">
            <Facebook />
          </a>
        </li>
        <li>
          <a href="https://www.x.com/">
            <X />
          </a>
        </li>
      </ul>
    </div>
  );
}
