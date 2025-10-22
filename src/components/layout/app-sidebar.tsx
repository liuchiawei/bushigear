import Link from "next/link";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ShoppingBag, Store, Mail, ChevronDown } from "lucide-react";

export default function AppSidebar() {
  return (
    <Sidebar className="backdrop-blur-sm bg-sidebar/40">
      <SidebarHeader>
        <div className="flex-none flex items-center justify-between gap-2 overflow-hidden">
          <SidebarTrigger />
          <Link
            href="/"
            className="w-full text-center text-lg md:text-xl font-sans font-[900] uppercase whitespace-nowrap transition-all opacity-100 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:hidden"
          >
            <Image
              src="/logo/logo_text.svg"
              alt="logo"
              width={120}
              height={40}
              objectFit="cover"
            />
          </Link>
        </div>
        <div className="flex items-center justify-center p-8 relative transition-all opacity-100 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:hidden select-none">
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 size-20 bg-secondary rounded-full z-0" />
          <h3 className="text-center text-foreground text-5xl font-sans font-[900] tracking-[-0.1em] [writing-mode:vertical-lr] whitespace-nowrap z-10">
            ブシギア
          </h3>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <Collapsible defaultOpen className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip="商品一覧" asChild>
                    <Link href="/products">
                      <ShoppingBag />
                      <span className="flex justify-between items-center w-full hover:text-background font-bold">
                        商品一覧
                        <ChevronDown className="transition-transform group-data-[state=open]/collapsible:rotate-180" />
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link href="/category/glove">グローブ</Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link href="/category/mitt">ミット</Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link href="/category/protector">プロテクター</Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link href="/category/cloth">服</Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="ブシギアについて" asChild>
                <Link href="/">
                  <Store />
                  <span className="font-bold hover:text-background">
                    ブシギアについて
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="お問い合わせ" asChild>
                <Link href="/">
                  <Mail />
                  <span className="font-bold hover:text-background">
                    お問い合わせ
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
