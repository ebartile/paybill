import { useState } from "react";
import { Button, Form, Input } from "~/components/ui";
import * as Yup from "yup";

import CTABanner from "~/components/layouts/CTABanner";
import Layout from "~/components/layouts/Default";
import SectionContainer from "~/components/layouts/SectionContainer";
import { Download } from "lucide-react";

const DPA = () => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>();
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  const INITIAL_VALUES = { email: "" };

  const FormSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
  });

  const handleFormSubmit = async (
    values: typeof INITIAL_VALUES,
    { resetForm }: any,
  ) => {
    try {
      setError(undefined);
      // TODO: Replace with your actual API call to store the email

      resetForm();
      setFormSubmitted(true);
      // TODO: replace with the actual URL of the Data Processing Agreement document
      window.open("#", "_blank");
    } catch (error: any) {
      setError(error.message);
    }
  };
  return (
    <>
      <Layout>
        <SectionContainer>
          <div className="mx-auto grid max-w-2xl grid-cols-12 rounded-lg">
            <div className="col-span-12 flex items-center lg:col-span-12">
              <div className="prose flex flex-col space-y-8 pb-16">
                <h1 className="text-center text-5xl">
                  Data Processing Agreement
                </h1>
                <p>
                  We have a long-standing commitment to customer privacy and
                  data protection, and as part of that commitment we have
                  prepared a pre-signed Data Processing Addendum ("DPA").
                </p>

                <p>
                  You can download our latest Data Processing Agreement document
                  by submitting your email here. For the document to be
                  considered executed, you must return the signed Data
                  Processing Agreement document to{" "}
                  <a
                    href="mailto:privacy@paybill.dev"
                    target="_blank"
                    className="text-brand hover:text-brand"
                  >
                    privacy@paybill.dev
                  </a>
                  .
                </p>

                {formSubmitted ? (
                  <p className="text-brand">
                    Thank you for your submission! A new tab should have opened
                    with the Data Processing Agreement document
                  </p>
                ) : (
                  <Form
                    initialValues={INITIAL_VALUES}
                    validationSchema={FormSchema}
                    onSubmit={handleFormSubmit}
                  >
                    {({ isSubmitting }: any) => (
                        <>
                        <Input
                          value={email}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                          type="email"
                          name="email"
                          id="email"
                          required
                          descriptionText="We only keep a record of your email so we can update you when the document has been updated."
                          placeholder="Your email address"
                          error={error}
                          actions={
                          <Button
                            htmlType="submit"
                            type="default"
                            iconRight={<Download />}
                            className="mr-1"
                            loading={isSubmitting}
                          >
                            Download DPA
                          </Button>
                          }
                        />
                        {error && <p>{error}</p>}
                        </>
                    )}
                  </Form>
                )}
              </div>
            </div>
          </div>
        </SectionContainer>
        <CTABanner />
      </Layout>
    </>
  );
};
export default DPA;
