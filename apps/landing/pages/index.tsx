import dynamic from "next/dynamic";
import Layout from "~/components/layouts/Default";
import Hero from "~/components/layouts/Hero/Hero";
import HeroFrameworks from "~/components/layouts/Hero/HeroFrameworks";

const Features = dynamic(() => import("components/layouts/Features/index"));
const CTABanner = dynamic(() => import("components/layouts/CTABanner/index"));

const Index = () => {
  return (
    <Layout>
      <Hero />
      <HeroFrameworks />
      <Features />
      <CTABanner className="border-none" />
    </Layout>
  );
};

export default Index;
