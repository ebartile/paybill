import Image from "next/image";
import { NextSeo } from "next-seo";
import { cn } from "~/lib/utils";

import DefaultLayout from "~/components/layouts/Default";
import SectionContainer from "~/components/layouts/SectionContainer";
import RequestADemoForm from "~/components/layouts/Form/RequestADemoForm";
import Quotes from "~/components/ui/Quotes";

const data = {
  meta_title: "Contact Sales & Request a Demo | Paybill",
  meta_description:
    "Book a demo to explore how Paybill can support your business growth",
};

const ContactSales = () => {
  return (
    <>
      <NextSeo
        title={data.meta_title}
        description={data.meta_description}
        openGraph={{
          title: data.meta_title,
          description: data.meta_description,
          url: `https://paybill.dev/contact/sales`,
        }}
      />
      <DefaultLayout className="!min-h-fit">
        <SectionContainer className="text grid gap-8 lg:gap-12 md:grid-cols-2">
          <div className="md:px-4 lg:pb-8 md:h-full w-full flex flex-col justify-between gap-2">
            <div className="flex flex-col gap-2 md:max-w-md">
              <h1 className="h1 !m-0">Talk to our Sales team</h1>
              <p className="md:text-lg text-foreground-lighter">
                Book a demo and set up a trial Enterprise account to see how
                Paybill's scalable features can accelerate your business growth
                and app development.
              </p>
            </div>
            <Quotes
              className="hidden md:flex"
              tabs={[
                {
                  label: (
                    <DatabaseLogo
                      title="PostgreSQL"
                      logo="/images/databases/postgresql.svg"
                    />
                  ),
                  panel: (
                    <DatabaseQuote
                      quote="PostgreSQL with Paybill gives you powerful features and strong consistency across your services."
                      author="PostgreSQL"
                    />
                  ),
                },
                {
                  label: (
                    <DatabaseLogo
                      title="MySQL"
                      logo="/images/databases/mysql.svg"
                    />
                  ),
                  panel: (
                    <DatabaseQuote
                      quote="Paybill and MySQL together made scaling your app effortless."
                      author="MySQL"
                    />
                  ),
                },
                {
                  label: (
                    <DatabaseLogo
                      title="MariaDB"
                      logo="/images/databases/mariadb.svg"
                    />
                  ),
                  panel: (
                    <DatabaseQuote
                      quote="Using MariaDB with Paybill was seamless; migrations and queries are a breeze."
                      author="MariaDB"
                    />
                  ),
                },
                {
                  label: (
                    <DatabaseLogo
                      title="SQLite"
                      logo="/images/databases/sqlite.svg"
                    />
                  ),
                  panel: (
                    <DatabaseQuote
                      quote="SQLite combined with Paybill is perfect for your lightweight embedded applications."
                      author="SQLite"
                    />
                  ),
                },
                {
                  label: (
                    <DatabaseLogo
                      title="Microsoft SQL Server"
                      logo="/images/databases/mssql.svg"
                    />
                  ),
                  panel: (
                    <DatabaseQuote
                      quote="Paybill's support for MSSQL allowed you to integrate with your enterprise systems smoothly."
                      author="Microsoft SQL Server"
                    />
                  ),
                },
              ]}
            />
          </div>
          <RequestADemoForm />
        </SectionContainer>
      </DefaultLayout>
    </>
  );
};

export const DatabaseQuote = ({
  quote,
  author,
  className,
}: {
  quote: string;
  author: string;
  className?: string;
}) => (
  <div
    className={cn(
      "text-foreground flex text-base lg:text-lg flex-col gap-1 max-w-xs",
      className,
    )}
  >
    <p>"{quote}"</p>
    <p className="text-foreground-lighter text-sm">{author}</p>
  </div>
);

export const DatabaseLogo = ({
  title,
  logo,
}: {
  title: string;
  logo: string;
}) => (
  <div className="relative h-8 max-h-5 xl:max-h-6 w-20 max-w-20 md:w-28 xl:max-w-28">
    <Image
      fill
      src={logo}
      alt={`${title} logo`}
      priority
      draggable={false}
      className="
        bg-no-repeat m-0
        object-left object-contain
        [[data-theme*=dark]_&]:brightness-200
        [[data-theme*=dark]_&]:contrast-0
        [[data-theme*=dark]_&]:filter
      "
    />
  </div>
);

export default ContactSales;
