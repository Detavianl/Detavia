import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import MobileCtaBar from "@/components/MobileCtaBar";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="pb-20 md:pb-0">{children}</main>
      <SiteFooter />
      <MobileCtaBar />
    </>
  );
}
