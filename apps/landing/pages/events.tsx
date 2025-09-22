import { useState, useEffect, useMemo } from "react";
import { NextSeo } from "next-seo";

import { cn } from "~/lib/utils";
import DefaultLayout from "~/components/layouts/Default";
import EventListItem from "~/components/layouts/Events/EventListItem";
import EventsFilters from "~/components/layouts/Events/EventsFilters";
import SectionContainer from "~/components/layouts/SectionContainer";

import type BlogPost from "types/post";
import { isBrowser } from "~/lib/helpers";
import EventGridItem from "~/components/layouts/Events/EventGridItem";

interface Props {
  events: BlogPost[];
  onDemandEvents: BlogPost[];
  categories: { [key: string]: number };
}

export type EventView = "list" | "grid";

export default function Events({
  onDemandEvents,
  categories: staticCategories,
}: Props) {
  const [lumaEvents, setLumaEvents] = useState<BlogPost[]>([]);
  const [isLoadingLuma, setIsLoadingLuma] = useState(true);
  const [filteredEvents, setFilteredEvents] = useState<BlogPost[]>([]);
  const localView = isBrowser
    ? (localStorage?.getItem("paybill-event-view") as EventView)
    : undefined;
  const [view, setView] = useState<EventView>(localView ?? "list");
  const isList = view === "list";

  // Fetch Luma events on client-side to avoid serverless maximum size limit error: https://vercel.com/guides/troubleshooting-function-250mb-limit
  useEffect(() => {
    const fetchLumaEvents = async () => {
      try {
        const afterDate = new Date().toISOString();
        const url = new URL("/api-v2/luma-events", window.location.origin);
        url.searchParams.append("after", afterDate);

        const res = await fetch(url.toString());
        const data = await res.json();

        if (data.success) {
          const transformedEvents = data.events.map((event: any) => {
            let categories = [];
            if (event.name.toLowerCase().includes("meetup"))
              categories.push("meetup");

            return {
              slug: "",
              type: "event",
              title: event?.name,
              date: event?.start_at,
              description: "",
              thumb: "",
              path: "",
              url: event?.url ?? "",
              tags: categories,
              categories,
              timezone: event?.timezone ?? "Europe/London",
              disable_page_build: true,
              link: {
                href: event?.url ?? "#",
                target: "_blank",
              },
            } as BlogPost;
          });
          setLumaEvents(transformedEvents);
        }
      } catch (error) {
        console.error("Error fetching Luma events:", error);
      } finally {
        setIsLoadingLuma(false);
      }
    };

    fetchLumaEvents();
  }, []);

  // Combine static and Luma events
  const allEvents = useMemo(() => {
    return lumaEvents.filter((event: BlogPost) =>
      event.end_date
        ? new Date(event.end_date!) >= new Date()
        : new Date(event.date!) >= new Date(),
    );
  }, [lumaEvents]);

  // Initialize filtered events when allEvents changes
  useEffect(() => {
    setFilteredEvents(allEvents);
  }, [allEvents]);

  // Recalculate categories with Luma events included
  const categories = useMemo(() => {
    const updatedCategories = { ...staticCategories };

    lumaEvents.forEach((event) => {
      updatedCategories.all = (updatedCategories.all || 0) + 1;

      event.categories?.forEach((category) => {
        updatedCategories[category] = (updatedCategories[category] || 0) + 1;
      });
    });

    return updatedCategories;
  }, [staticCategories, lumaEvents]);

  const meta_title = "Paybill Events: webinars, talks, hackathons, and meetups";
  const meta_description =
    "Join Paybill and the open-source community at the upcoming events.";

  return (
    <>
      <NextSeo
        title={meta_title}
        description={meta_description}
        openGraph={{
          title: meta_title,
          description: meta_description,
          url: `https://paybill.dev/events`,
          images: [
            {
              url: `https://paybill.dev/logo-preview.png`,
            },
          ],
        }}
        additionalLinkTags={[
          {
            rel: "alternate",
            type: "application/rss+xml",
            href: `https://paybill.dev/rss.xml`,
          },
        ]}
      />
      <DefaultLayout className="min-h-[80dvh]">
        <SectionContainer className="!py-8 lg:!py-16">
          <h1 className="h1">
            <span className="sr-only">Paybill</span> Events
          </h1>
          <p className="text-foreground-light">
            Join us at the following upcoming events
          </p>
        </SectionContainer>
        <SectionContainer className="!py-0">
          <EventsFilters
            allEvents={allEvents}
            onDemandEvents={onDemandEvents}
            events={filteredEvents}
            setEvents={setFilteredEvents}
            view={view as EventView}
            setView={setView}
            categories={categories}
          />
          <ol
            className={cn(
              "grid -mx-2 sm:-mx-4 py-6 lg:py-6 lg:pb-20",
              !filteredEvents?.length && "mx-0 sm:mx-0",
              filteredEvents?.length === 0
                ? "grid-cols-1"
                : isList
                ? "grid-cols-1"
                : "grid-cols-12 lg:gap-4"
            )}
          >
            {filteredEvents?.length ? (
              filteredEvents
                ?.sort(
                  (a, b) =>
                    new Date(a.date!).getTime() - new Date(b.date!).getTime(),
                )
                .map((event: BlogPost, idx: number) =>
                  isList ? (
                    <div
                      className="col-span-12 px-2 sm:px-4 [&_a]:last:border-none"
                      key={`${event.title}-upcoming-${idx}`}
                    >
                      <EventListItem event={event} />
                    </div>
                  ) : (
                    <div
                      className="col-span-12 mb-4 md:col-span-12 lg:col-span-6 xl:col-span-4 h-full"
                      key={`${event.title}-upcoming-${idx}`}
                    >
                      <EventGridItem event={event} />
                    </div>
                  ),
                )
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                {isLoadingLuma ? (
                  <div className="text-center">
                    <p className="text-foreground-muted">Loading events...</p>
                  </div>
                ) : (
                  <p className="text-foreground-muted">No results found.</p>
                )}
              </div>
            )}
          </ol>
        </SectionContainer>
      </DefaultLayout>
    </>
  );
}
