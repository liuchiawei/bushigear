import { Instagram, Facebook, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export default function SNS(
  {className, containerClassName}:
  {className?: string, containerClassName?: string}) {
  return (
    <ul className={cn("flex justify-center items-center gap-2 [&_li]:cursor-pointer", containerClassName)}>
      {SNSList.map((sns) => (
        <SNSItem key={sns.title} title={sns.title} href={sns.href} icon={sns.icon} className={className} />
      ))}
    </ul>
  );
}

const SNSItem = (
  { title,
    href,
    icon,
    className
  }:
  { title: string;
    href: string;
    icon: React.ReactNode;
    className?: string;
  }) => {
  return (
    <li>
      <Tooltip>
        <TooltipTrigger>
          <a title={title} href={href} target="_blank" className={className}>
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