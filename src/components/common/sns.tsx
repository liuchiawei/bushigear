import { Instagram, Facebook, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function SNS() {
  return (
    <ul className="flex justify-center items-center gap-2 [&_li]:cursor-pointer">
      {SNSList.map((sns) => (
        <SNSItem key={sns.title} title={sns.title} href={sns.href} icon={sns.icon} />
      ))}
    </ul>
  );
}

const SNSItem = (
  { title,
    href,
    icon
  }:
  { title: string;
    href: string;
    icon: React.ReactNode
  }) => {
  return (
    <li>
      <Tooltip>
        <TooltipTrigger>
          <a title={title} href={href}>
            {icon}
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
    icon: <Instagram />,
  },
  {
    title: "Facebook",
    href: "https://www.facebook.com/",
    icon: <Facebook />,
  },
  {
    title: "X",
    href: "https://www.x.com/",
    icon: <X />,
  },
];