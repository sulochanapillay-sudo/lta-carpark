import { Carpark } from '../types';

/**
 * Exports carpark dataset to a standard CSV file with UTF-8 BOM encoding
 * for instant compatibility with Microsoft Excel, Google Sheets, and Numbers.
 */
export function exportCarparksToCSV(carparks: Carpark[], customFilename?: string) {
  const headers = [
    'Carpark ID',
    'Carpark Code',
    'Carpark Name',
    'Address',
    'Area',
    'Agency',
    'Carpark Type',
    'Payment System',
    'Latitude',
    'Longitude',
    'Height Limit',
    'Available Lots',
    'Cars Available Lots',
    'Motorcycles Available Lots',
    'Heavy Vehicles Available Lots',
    'Weekday Rate',
    'Saturday Rate',
    'Sunday / PH Rate',
    'Grace Period (mins)',
    'Distance (meters)',
    'Last Updated',
  ];

  const escapeCSV = (val: unknown): string => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = carparks.map((cp) => {
    const cars = cp.lotsBreakdown?.find((b) => b.type === 'C')?.availableLots ?? '';
    const motorcycles = cp.lotsBreakdown?.find((b) => b.type === 'Y')?.availableLots ?? '';
    const heavy = cp.lotsBreakdown?.find((b) => b.type === 'H')?.availableLots ?? '';

    return [
      escapeCSV(cp.id),
      escapeCSV(cp.code),
      escapeCSV(cp.name),
      escapeCSV(cp.address),
      escapeCSV(cp.area),
      escapeCSV(cp.agency),
      escapeCSV(cp.carparkType),
      escapeCSV(cp.paymentSystem),
      escapeCSV(cp.latitude),
      escapeCSV(cp.longitude),
      escapeCSV(cp.heightLimit ? `${cp.heightLimit}m` : 'No Limit'),
      escapeCSV(cp.availableLots),
      escapeCSV(cars),
      escapeCSV(motorcycles),
      escapeCSV(heavy),
      escapeCSV(cp.rates?.weekdayMinRate ?? ''),
      escapeCSV(cp.rates?.saturdayRate ?? ''),
      escapeCSV(cp.rates?.sundayRate ?? ''),
      escapeCSV(cp.rates?.gracePeriodMinutes ?? ''),
      escapeCSV(cp.distance !== undefined ? Math.round(cp.distance) : ''),
      escapeCSV(cp.lastUpdated),
    ].join(',');
  });

  // UTF-8 BOM '\uFEFF' ensures non-ASCII characters open properly in Excel
  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const exportDate = new Date().toISOString().slice(0, 10);
  link.setAttribute('download', customFilename || `singapore_carparks_dataset_${exportDate}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
