export async function fetchLocation(
  lat: number,
  lon: number
) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
  );

  return await res.json();
}