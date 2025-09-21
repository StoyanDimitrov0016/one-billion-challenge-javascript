function temperature_rounder(temperature: number) {
  const absolute_value = Math.abs(temperature);

  const rounded = Math.round(absolute_value * 10) / 10;

  return Math.sign(temperature) * rounded;
}

export function create_output_item(city: string, min: number, mean: number, max: number) {
  const min_rounded = temperature_rounder(min);
  const mean_rounded = temperature_rounder(mean);
  const max_rounded = temperature_rounder(max);

  return `${city}=${min_rounded.toFixed(1)}/${mean_rounded.toFixed(1)}/${max_rounded.toFixed(1)}`;
}
