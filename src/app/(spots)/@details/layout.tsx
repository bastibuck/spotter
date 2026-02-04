import CloseDetails from "./_components/CloseDetails";

const DetailsLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <>
      <CloseDetails />

      <div className="ocean-gradient fixed top-0 right-0 bottom-0 z-50 w-full max-w-2xl overflow-y-auto border-l border-white/10 shadow-2xl">
        <div className="p-8">{children}</div>
      </div>
    </>
  );
};

export default DetailsLayout;
