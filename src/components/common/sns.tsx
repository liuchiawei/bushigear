import { Instagram, Facebook, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function SNS() {
  return (
    <ul className="flex flex-row justify-center items-center [&_li]:cursor-pointer ">
      {SNSList.map((sns) => (
        <SNSItem key={sns.title} title={sns.title} href={sns.href} />
      ))}
    </ul>
  );
}

const SNSItem = ({ title, href }: { title: string; href: string }) => {
  return (
    <li>
      <Tooltip>
        <TooltipTrigger>
          <a title={title} href={href}>
            <Instagram />
          </a>
        </TooltipTrigger>
        <TooltipContent>
          <p>{title}</p>
        </TooltipContent>
      </Tooltip>
    </li>
  );
};

const SNSList = [
  {
    title: "Instagram",
    href: "https://www.instagram.com/",
  },
  {
    title: "Facebook",
    href: "https://www.facebook.com/",
  },
  {
    title: "X",
    href: "https://www.x.com/",
  },
];