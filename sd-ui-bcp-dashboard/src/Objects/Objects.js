export const columnMap = {
    "Month/Year": "MonthYear",
    "Company Name": "CompanyName",
    "Revenue Actual": "RevenueActual",
    "Revenue Budget": "RevenueBudget",
    "Gross Profit Actual": "GrossProfitActual",
    "Gross Profit Budget": "GrossProfitBudget",
    "SG & A Actual": "SGAActual",
    "SG & A Budget": "SGABudget",
    "EBITDA Actual": "EBITDAActual",
    "EBITDA Budget": "EBITDABudget",
    "CapEx Actual": "CapExActual",
    "CapEx Budget": "CapExBudget",
    "Fixed Assets (Net) Actual": "FixedAssetsNetActual",
    "Fixed Assets (Net) Budget": "FixedAssetsNetBudget",
    "Cash Actual": "CashActual",
    "Cash Budget": "CashBudget",
    "Total Debt Actual": "TotalDebtActual",
    "Total Debt Budget": "TotalDebtBudget",
    "Accounts Receivable Actual": "AccountsReceivableActual",
    "Accounts Receivable Budget": "AccountsReceivableBudget",
    "Accounts Payable Actual": "AccountsPayableActual",
    "Accounts Payable Budget": "AccountsPayableBudget",
    "Inventory Actual": "InventoryActual",
    "Inventory Budget": "InventoryBudget",
    "Employees Actual": "EmployeesActual",
    "Employees Budget": "EmployeesBudget",
    "Quarter": "Quarter"
  };

  export const reverseColumnMap = (columnMap) => {
    const reversedMap = {};
    // Iterate over the keys of the original columnMap object
    Object.keys(columnMap).forEach((key) => {
      const value = columnMap[key];
      // Swap the key and value in the reversedMap object
      reversedMap[value] = key;
    });
    return reversedMap;
  };
