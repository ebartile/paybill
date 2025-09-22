"use client";

import Link from "next/link";
import { PropsWithChildren, useState } from "react";

import { 
  Admonition,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogSection,
  DialogTitle,
  Switch,
  Button
} from "~/components/ui";
import { useConsentState } from "~/lib/consent-state";

interface PrivacySettingsProps {
  className?: string;
}

export const PrivacySettings = ({
  children,
  ...props
}: PropsWithChildren<PrivacySettingsProps>) => {
  const [isOpen, setIsOpen] = useState(false);
  const { categories, updateServices } = useConsentState();

  const [serviceConsentMap, setServiceConsentMap] = useState(
    () => new Map<string, boolean>()
  );

  function handleServicesChange(services: { id: string; status: boolean }[]) {
    const newServiceConsentMap = new Map(serviceConsentMap);
    services.forEach((service) => {
      newServiceConsentMap.set(service.id, service.status);
    });
    setServiceConsentMap(newServiceConsentMap);
  }

  const handleConfirmPreferences = () => {
    const services = Array.from(serviceConsentMap.entries()).map(
      ([id, status]) => ({
        serviceId: id,
        status,
      })
    );
    updateServices(services);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button {...props} onClick={() => setIsOpen(true)}>
        {children}
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent size="medium" className="max-w-[calc(100vw-4rem)]">
          <DialogHeader className="border-b" padding="small">
            <DialogTitle>Privacy Settings</DialogTitle>
          </DialogHeader>

          <DialogSection padding="small" className="pt-3 divide-y divide-border">
            {categories === null ? (
              <Admonition
                type="warning"
                title="Unable to Load Privacy Settings"
                description={
                  <>
                    We couldn't load the privacy settings due to an ad blocker
                    or network error. Please disable any ad blockers and try
                    again. If the problem persists, please{" "}
                    <Link
                      href="https://cloud.paybill.dev/support/new"
                      className="underline"
                    >
                      contact support
                    </Link>
                    .
                  </>
                }
              />
            ) : (
              [...categories].reverse().map((category) => (
                <Category
                  key={category.slug}
                  category={category}
                  handleServicesChange={handleServicesChange}
                />
              ))
            )}
          </DialogSection>

          <DialogFooter padding="small">
            <Button type="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleConfirmPreferences}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

function Category({
  category,
  handleServicesChange,
}: {
  category: {
    slug: string;
    label: string;
    description: string;
    isEssential: boolean;
    services: readonly {
      id: string;
      consent: {
        status: boolean;
      };
    }[];
  };
  handleServicesChange: (services: { id: string; status: boolean }[]) => void;
}) {
  const [isChecked, setIsChecked] = useState(() =>
    category.services.every((service) => service.consent.status)
  );

  function handleChange(checked: boolean) {
    setIsChecked(checked);

    handleServicesChange(
      category.services.map((service) => ({
        id: service.id,
        status: checked,
      }))
    );
  }

  return (
    <DialogSection key={category.slug} padding="small" className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium">{category.label}</div>
          <div className="text-sm text-muted-foreground">
            {category.description}{" "}
            <Link
              href="legal/privacy#8-cookies-and-similar-technologies-used-on-our-european-services"
              className="underline"
            >
              Learn more
            </Link>
          </div>
        </div>
        <Switch
          checked={isChecked}
          onCheckedChange={handleChange}
          disabled={category.isEssential}
        />
      </div>
    </DialogSection>
  );
}
