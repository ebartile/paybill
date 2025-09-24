import Link from "next/link";

import { Button } from "~/components/ui";
import SectionContainer from "../SectionContainer";

const Hero = () => {
  return (
    <div className="relative -mt-[65px]">
      <SectionContainer className="pt-8 pb-10 md:pt-16 overflow-hidden">
        <div className="relative">
          <div className="mx-auto">
            <div className="mx-auto max-w-2xl lg:col-span-6 lg:flex lg:items-center justify-center text-center">
              <div className="relative z-10 lg:h-auto pt-[90px] lg:pt-[90px] lg:min-h-[300px] flex flex-col items-center justify-center sm:mx-auto md:w-3/4 lg:mx-0 lg:w-full gap-4 lg:gap-8">
                <div className="flex flex-col items-center">
                  <h1 className="text-foreground text-4xl sm:text-5xl sm:leading-none lg:text-7xl">
                    <span className="block text-foreground">
                      Simple is better than Complex
                    </span>
                    <span className="text-brand block md:ml-0">
                      Salesforce Alternative
                    </span>
                  </h1>
                  <p className="pt-2 text-foreground my-3 text-sm sm:mt-5 lg:mb-0 sm:text-base lg:text-lg">
                    Start your project with any database of your choice,
                    authentication, instant APIs, edge functions, storage and
                    other things that frameworks provide.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button asChild size="medium">
                    <Link
                      href="https://cloud.paybill.dev"
                      as="https://cloud.paybill.dev"
                    >
                      Start your project
                    </Link>
                  </Button>
                  <Button asChild size="medium" type="default">
                    <Link href="/contact/sales" as="/contact/sales">
                      Request a demo
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
};

export default Hero;
