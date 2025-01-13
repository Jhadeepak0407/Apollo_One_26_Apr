export  const fetchChecklistByRole = async (EmpID,locationid) => {
  try {
    const response = await fetch(
      `http://10.10.9.89:203/api/Users/ViewCheckListbyRole?EmpID=${EmpID}&locationid=${locationid}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
    } catch (error) {
      console.error("Error fetching CheckListTypeName:", error);
      return [];
    }
  };


  export  const AllCheckListType = async (locationId) => {
    try {
      const response = await fetch(
        `http://10.10.9.89:203/api/Users/AllCheckListType?LocationId=${locationId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return data;
      } catch (error) {
        console.error("Error fetching CheckListTypeName:", error);
        return [];
      }
    };

      export const fetchMenuDetailSchedule = async (checklistId, fromDate, toDate,locationId) => {
        try {
        ///  const formattedFromDate = formatDate(fromDate || new Date());
         ////// const formattedToDate = formatDate(toDate || new Date());
      
          const apiUrl = `http://10.10.9.89:203/api/Users/ScheduleTaksListByCheckListID?checklistid=${checklistId}&from=${fromDate}&to=${toDate}&locationId=${locationId}`;
          
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