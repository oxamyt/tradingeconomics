import { fetchHistoricalData } from "./Api";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DataItem, RawDataItem, GroupedData } from "./types/types";

const countries = ["Mexico", "Thailand", "Sweden", "New Zealand"];

function App() {
  const [chartData, setChartData] = useState<DataItem[]>([]);

  const [selectedCountries, setSelectedCountries] = useState<[string, string]>([
    "Mexico",
    "Sweden",
  ]);

  const transformData = (data: RawDataItem[]): DataItem[] => {
    const groupDate = data.reduce<GroupedData>((acc, item) => {
      const date = item.DateTime;
      if (!acc[date]) {
        acc[date] = {
          DateTime: date,
        };
      }
      acc[date][item.Country] = item.Value;
      return acc;
    }, {});

    return Object.values(groupDate).map((item) => {
      return {
        dateTime: item.DateTime,
        ...item,
      };
    });
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const rawData = await fetchHistoricalData(selectedCountries);
        const transformedData = transformData(rawData);
        setChartData(transformedData);
      } catch (error) {
        console.error("Error fetching or transforming data:", error);
        setChartData([]);
      }
    };
    loadData();
  }, [selectedCountries]);

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);

      return date.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      });
    } catch (e) {
      console.error("Error formatting date:", dateString, e);
      return dateString;
    }
  };

  const handleCountryChange = (
    index: number,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const otherIndex = index === 0 ? 1 : 0;
    const otherCountry = selectedCountries[otherIndex];

    if (event.target.value === otherCountry) {
      alert("Please select two different countries.");
      return;
    }

    const newSelectedCountries: [string, string] = [...selectedCountries];
    newSelectedCountries[index] = event.target.value;
    setSelectedCountries(newSelectedCountries);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl flex flex-col space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            GDP Comparison
          </h2>
          <div className="flex items-center justify-start gap-6">
            <div className="space-y-2 space-x-2">
              <label htmlFor="country1" className="text-sm text-gray-600">
                Country 1
              </label>
              <select
                id="country1"
                value={selectedCountries[0]}
                onChange={(e) => handleCountryChange(0, e)}
                className="w-48 p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700"
              >
                {countries.map((country) => (
                  <option
                    key={`${country}`}
                    value={country}
                    disabled={country === selectedCountries[1]}
                  >
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2 space-x-2">
              <label htmlFor="country2" className="text-sm text-gray-600">
                Country 2
              </label>
              <select
                id="country2"
                value={selectedCountries[1]}
                onChange={(e) => handleCountryChange(1, e)}
                className="w-48 p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 "
              >
                {countries.map((country) => (
                  <option
                    key={`${country}`}
                    value={country}
                    disabled={country === selectedCountries[0]}
                  >
                    {country}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 flex-grow">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={700}>
              <LineChart
                margin={{ top: 20, right: 30, bottom: 50, left: 20 }}
                data={chartData}
              >
                <Legend
                  verticalAlign="top"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: "20px", color: "#4B5563" }}
                />
                <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" />
                <Tooltip
                  labelFormatter={formatDate}
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #E5E7EB",
                    borderRadius: "6px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  }}
                />
                <XAxis
                  dataKey="dateTime"
                  tickFormatter={formatDate}
                  angle={-15}
                  textAnchor="end"
                  height={50}
                  stroke="#9CA3AF"
                  tick={{ fill: "#6B7280", fontSize: 18 }}
                />
                <YAxis
                  stroke="#9CA3AF"
                  tick={{ fill: "#6B7280", fontSize: 14 }}
                />
                {selectedCountries.map((country, index) => (
                  <Line
                    key={country}
                    name={`${country} GDP`}
                    type="monotone"
                    dataKey={country}
                    stroke={index === 0 ? "#3B82F6" : "#10B981"}
                    strokeWidth={2}
                    connectNulls
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[500px] flex items-center justify-center text-gray-500">
              Loading data...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
