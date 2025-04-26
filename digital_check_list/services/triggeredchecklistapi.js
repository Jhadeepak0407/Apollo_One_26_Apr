export const fetchDepartments = async (locationId) => {
    try {
      const response = await fetch(
        `http://10.10.9.89:203/api/Users/DepartmentMasterListByLocation?locationid=${locationId}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching departments:", error);
      return [];
    }
  };

  export const fetchAllotedDepartments = async (locationId , ctid , empid) => {
    try {
      const response = await fetch(
        `http://10.10.9.89:203/api/Users/GetAllotedDepartmentDetails?locationid=${locationId}&ctid=${ctid}&empid=${empid}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching departments:", error);
      return [];
    }
  };
  
  export const fetchCheckLists = async (locationId, departmentId,ctid) => {
    try {
      const response = await fetch(
        `http://10.10.9.89:203/api/Users/CheckListMasterListByDepartment?locationid=${locationId}&departmentid=${departmentId}&ctid=${ctid}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching checklists:", error);
      return [];
    }
  };
  export const getfetchCheckLists = async (locationId, departmentId,ctid,id) => {
    try {
      const response = await fetch(
        `http://10.10.9.89:203/api/Users/CheckListMasterListByDepartment?empid=${id}&locationid=${locationId}&departmentid=${departmentId}&ctid=${ctid}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching checklists:", error);
      return [];
    }
  };
  
  export const fetchMenuDetails = async (checklistId, fromDate, toDate) => {
    try {
      const formattedFromDate = formatDate(fromDate || new Date());
      const formattedToDate = formatDate(toDate || new Date());
  
      const apiUrl = `http://10.10.9.89:203/api/Users/TaksListByCheckListID?checklistid=${checklistId}&from=${formattedFromDate}&to=${formattedToDate}`;
      const response = await fetch(apiUrl);
      console.log("Response Status:", response.status);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching menu details:", error);
      return [];
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  