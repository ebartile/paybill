import { ElementRef, forwardRef } from "react";
import { FormItem_Shadcn_ } from "~/components/ui";
import { FormLayout } from "./FormLayout";

const FormItemLayout = forwardRef<
  ElementRef<typeof FormLayout>,
  React.ComponentPropsWithoutRef<typeof FormLayout> // Use any as placeholder types
>(({ ...props }, ref) => {
  return (
    <FormItem_Shadcn_>
      <FormLayout ref={ref} isReactForm {...props}>
        {props.children}
      </FormLayout>
    </FormItem_Shadcn_>
  );
});

FormItemLayout.displayName = "FormItemLayout";

export { FormItemLayout };
