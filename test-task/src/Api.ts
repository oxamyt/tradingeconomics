const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = "https://api.tradingeconomics.com";

export async function fetchHistoricalData(countries: string[]) {
  const url = `${BASE_URL}/historical/country/${countries}/indicator/gdp?c=${API_KEY}`;

  try {
    const response = await fetch(url, { method: "GET" });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data", error);
    throw error;
  }
}
