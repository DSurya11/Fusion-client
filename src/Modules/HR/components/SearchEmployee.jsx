import React, { useState, useEffect, useRef } from "react";
import { Select } from "@mantine/core";
import PropTypes from "prop-types";
import { searchEmployees } from "../services/hrService";

function SearchEmployee({ onEmployeeSelect, initialSearch, onSearchError }) {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const hasAutoSearched = useRef(false);

  const fetchEmployees = async (text) => {
    if (text.length < 3) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const employees = await searchEmployees(text);

      const uniqueEmployees = employees.reduce((acc, employee) => {
        if (!acc[employee.id]) {
          acc[employee.id] = {
            value: `${employee.id}-${employee.username}`,
            label: `${employee.username}`,
            details: employee,
          };
        }
        return acc;
      }, {});

      const formattedResults = Object.values(uniqueEmployees);
      setSearchResults(formattedResults);

      return formattedResults;
    } catch (err) {
      const errorMsg = "Unable to fetch employees.";
      setError(errorMsg);
      onSearchError?.(errorMsg);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeSelection = (selectedValue) => {
    const employee = searchResults.find(
      (result) => result.value === selectedValue,
    );

    if (onEmployeeSelect && employee?.details) {
      onEmployeeSelect(employee.details);
    }
  };

  useEffect(() => {
    const autoSearch = async () => {
      if (initialSearch && !hasAutoSearched.current) {
        hasAutoSearched.current = true;
        const results = await fetchEmployees(initialSearch);
        if (results.length > 0) {
          const firstEmployee = results[0];
          onEmployeeSelect?.(firstEmployee.details);
        }
      }
    };
    autoSearch();
  }, [initialSearch, onEmployeeSelect]);

  return (
    <div style={{ maxWidth: "400px", marginBottom: "20px" }}>
      <Select
        label="Search Employee"
        placeholder="Type to search"
        searchable
        nothingFound={error || "No employees found"}
        data={searchResults}
        onSearchChange={(val) => {
          fetchEmployees(val);
        }}
        onChange={handleEmployeeSelection}
        disabled={loading}
      />
    </div>
  );
}

// ✅ PropTypes validation
SearchEmployee.propTypes = {
  onEmployeeSelect: PropTypes.func,
  initialSearch: PropTypes.string,
  onSearchError: PropTypes.func,
};

export default SearchEmployee;
