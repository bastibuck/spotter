import CloseDetails from "./_components/CloseDetails";

const DetailsLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <>
      <CloseDetails />

      <div className="fixed top-0 right-0 bottom-0 w-full max-w-7/9 bg-slate-900 p-4 text-white md:max-w-3/5 lg:max-w-2/5">
        {children}
      </div>
    </>
  );
};

export default DetailsLayout;
