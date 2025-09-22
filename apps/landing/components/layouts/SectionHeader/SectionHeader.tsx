const SectionHeader = (props: any) => {
  return (
    <div className={props.className}>
      <div className="space-y-4">
        <span className="text-foreground-lighter block font-mono text-xs uppercase tracking-widest">
          {props.subtitle}
        </span>
        <h3 className="h2 lg:max-w-md">
          <span>{props.title}</span>
          {props.title_alt && (
            <span className="text-foreground-light inline">
              {props.title_alt}
            </span>
          )}
        </h3>
      </div>
      {props.paragraph && (
        props.paragraph
      )}
    </div>
  );
};

export default SectionHeader;
