import React from "react";
import AdminNavbar from "../components/shared/admin/AdminNavbar";
import SidebarWithSearch from "../components/shared/SidebarWithSearch";
import { SIDEBAR_SEARCH } from "../constants/sidebar_search";
import { useSelector } from "react-redux";

const Adminpage = () => {
  const sidebar_item = useSelector((state) => state.sidebar_item.value);
  return (
    <div>
      <AdminNavbar />
      <div className="grid grid-cols-12">
        <div className="col-span-2">
          <SidebarWithSearch />
        </div>
        <div className="col-span-10">
          {SIDEBAR_SEARCH.map((item) =>
            item.sublist.map(
              (subitem) => subitem.label === sidebar_item && subitem.elements
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Adminpage;