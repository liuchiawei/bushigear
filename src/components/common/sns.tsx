import { Instagram } from "lucide-react";
import { Facebook } from "lucide-react";
import { X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function SNS() {
  return (
    <div className="flex flex-row justify-center items-center space-x-4">
      <ul className="flex flex-row  [&_li]:gap-y-4 [&_li]:cursor-pointer ">
        <li>
          <Tooltip>
            <TooltipTrigger>
              {" "}
              <a href="https://www.instagram.com/">
                <Instagram />
              </a>
            </TooltipTrigger>
            <TooltipContent>
              <p>Instagram</p>
            </TooltipContent>
          </Tooltip>
        </li>
        <li>
          <Tooltip>
            <TooltipTrigger>
              {" "}
              <a href="https://www.facebook.com/">
                <Facebook />
              </a>
            </TooltipTrigger>
            <TooltipContent>
              <p>Facebook</p>
            </TooltipContent>
          </Tooltip>
        </li>
        <li>
          <Tooltip>
            <TooltipTrigger>
              {" "}
              <a href="https://www.x.com/">
                <X />
              </a>
            </TooltipTrigger>
            <TooltipContent>
              <p>X</p>
            </TooltipContent>
          </Tooltip>
        </li>
      </ul>
    </div>
  );
}
