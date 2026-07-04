export async function fetchAQI(
  lat: number,
  lon: number
) {
  const res = await fetch(
    `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi`
  );

  return await res.json();
}