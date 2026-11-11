export function calgaryWeather(temperature = 12.3, observedAt = new Date().toISOString()) {
  return {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      properties: {
        air_temp: temperature,
        'air_temp-uom': '°C',
        'date_tm-value': observedAt,
        'msc_id-value': '3031094',
        'stn_nam-value': "CALGARY INT'L CS"
      }
    }]
  };
}
