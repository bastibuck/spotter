import CloseDetails from "./_components/CloseDetails";
import Backdrop from "./_components/Backdrop";

const DetailsLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Backdrop />

      <div className="ocean-gradient fixed top-0 right-0 bottom-0 z-50 w-full max-w-2xl overflow-y-auto border-l border-white/10 shadow-2xl">
        <div className="flex items-center gap-4 p-6 pb-0">
          <CloseDetails />
          <span className="text-ocean-300 text-sm font-medium">Back</span>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </>
  );
};

export default DetailsLayout;
