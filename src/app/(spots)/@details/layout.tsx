import CloseDetails from "./_components/CloseDetails";

const DetailsLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <>
      <CloseDetails />

      <div className="fixed top-0 right-0 bottom-0 w-full max-w-2/5 bg-slate-600 p-4 text-white">
        {children}
      </div>
    </>
  );
};

export default DetailsLayout;
