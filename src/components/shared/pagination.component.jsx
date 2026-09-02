import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { Button } from "@material-tailwind/react/components/Button";
import { CardFooter } from "@material-tailwind/react/components/Card";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { decrement, increment, setActive } from "../../features/slices/active.slice";
/** Handles pagination. */
const Pagination = ({ active: controlledActive, page, setActive: setControlledActive }) => {
  const storedActive = useSelector((state) => state.active.value);
  const active = controlledActive ?? storedActive;
  const dispatch = useDispatch();
  const setPage = (nextPage) => {
    if (setControlledActive) {
      setControlledActive(nextPage);
      return;
    }
    dispatch(setActive(nextPage));
  };
  /** Gets item props. */
  const getItemProps = (index) => ({
    variant: active === index ? "filled" : "text",
    className: active === index ? "bg-[#006edc] text-white" : "",
    /** Handles click. */
    onClick: () => setPage(index),
  });
  return (
    <>
      {page !== 1 && (
        <CardFooter>
          <div className="flex items-center justify-between border-blue-gray-50 p-1">
            <div></div>
            <div className="flex items-center">
              <Button
                variant="text"
                className="flex items-center gap-2"
                onClick={() =>
                  setControlledActive ? setPage(Math.max(1, active - 1)) : dispatch(decrement())
                }
                disabled={active === 1}
              >
                <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-2">
                {Array.from({ length: page }, (_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <Button key={pageNumber} {...getItemProps(pageNumber)}>
                      {pageNumber}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="text"
                className="flex items-center gap-2"
                onClick={() =>
                  setControlledActive ? setPage(Math.min(page, active + 1)) : dispatch(increment())
                }
                disabled={active === page}
              >
                <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardFooter>
      )}
    </>
  );
};
Pagination.propTypes = {
  active: PropTypes.number,
  page: PropTypes.number.isRequired,
  setActive: PropTypes.func,
};
export default Pagination;
