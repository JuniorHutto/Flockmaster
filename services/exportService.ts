import { Sheep } from '../types';

const escapeCSV = (value: string | number | undefined | null): string => {
  if (value === undefined || value === null) return '';
  const stringVal = String(value);
  // If the value contains commas, quotes, or newlines, escape it
  if (stringVal.includes(',') || stringVal.includes('"') || stringVal.includes('\n')) {
    return `"${stringVal.replace(/"/g, '""')}"`;
  }
  return stringVal;
};

const arrayToCSV = (headers: string[], data: any[]): string => {
  const csvRows = [headers.join(',')];
  
  for (const row of data) {
    const values = headers.map(header => {
       return escapeCSV(row[header]);
    });
    csvRows.push(values.join(','));
  }
  return csvRows.join('\n');
};

const downloadCSV = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportFlockData = (sheepList: Sheep[]) => {
  const dateStr = new Date().toISOString().split('T')[0];

  // 1. Export Inventory
  const inventoryHeaders = ['TagID', 'Name', 'Breed', 'Gender', 'Status', 'DOB', 'Color', 'SireID', 'DamID', 'SaleDate', 'SalePrice', 'Notes'];
  const inventoryData = sheepList.map(s => ({
    'TagID': s.tagId,
    'Name': s.name,
    'Breed': s.breed,
    'Gender': s.gender,
    'Status': s.status,
    'DOB': s.dob,
    'Color': s.color,
    'SireID': s.sireId,
    'DamID': s.damId,
    'SaleDate': s.saleDate,
    'SalePrice': s.salePrice,
    'Notes': s.notes
  }));
  
  const inventoryCSV = arrayToCSV(inventoryHeaders, inventoryData);
  downloadCSV(inventoryCSV, `flock_inventory_${dateStr}.csv`);

  // 2. Export Weights
  const weightHeaders = ['TagID', 'Date', 'Weight_Lbs', 'Note'];
  const weightData: any[] = [];
  sheepList.forEach(s => {
    s.weights.forEach(w => {
      weightData.push({
        'TagID': s.tagId,
        'Date': w.date,
        'Weight_Lbs': w.weight,
        'Note': w.note
      });
    });
  });

  if (weightData.length > 0) {
    // Slight delay to prevent browser blocking simultaneous downloads
    setTimeout(() => {
      const weightCSV = arrayToCSV(weightHeaders, weightData);
      downloadCSV(weightCSV, `flock_weights_${dateStr}.csv`);
    }, 500);
  }

  // 3. Export Health Records
  const healthHeaders = ['TagID', 'Date', 'Type', 'Description', 'Cost'];
  const healthData: any[] = [];
  sheepList.forEach(s => {
    s.health.forEach(h => {
      healthData.push({
        'TagID': s.tagId,
        'Date': h.date,
        'Type': h.type,
        'Description': h.description,
        'Cost': h.cost
      });
    });
  });

  if (healthData.length > 0) {
    // Another delay
    setTimeout(() => {
       const healthCSV = arrayToCSV(healthHeaders, healthData);
       downloadCSV(healthCSV, `flock_health_${dateStr}.csv`);
    }, 1000);
  }
};