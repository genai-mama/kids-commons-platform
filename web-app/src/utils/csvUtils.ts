// CSV操作のユーティリティ関数

// CSVエスケープ処理
const escapeCSVField = (field: string | number | boolean): string => {
  const str = String(field);
  // ダブルクォート、カンマ、改行を含む場合はダブルクォートで囲む
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    // ダブルクォートをエスケープ（""に変換）
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

// オブジェクトの配列をCSV文字列に変換
export const arrayToCSV = (data: any[], headers: string[]): string => {
  if (data.length === 0) return '';
  
  // ヘッダー行
  const headerRow = headers.map(escapeCSVField).join(',');
  
  // データ行
  const dataRows = data.map(item => {
    return headers.map(header => {
      const value = getNestedValue(item, header);
      return escapeCSVField(value ?? '');
    }).join(',');
  });
  
  return [headerRow, ...dataRows].join('\n');
};

// ネストしたオブジェクトの値を取得（例: "author.name"）
const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : '';
  }, obj);
};

// CSV文字列をオブジェクトの配列に変換
export const csvToArray = (csvString: string, headers: string[]): any[] => {
  const lines = csvString.trim().split('\n');
  if (lines.length <= 1) return [];
  
  // ヘッダー行をスキップ
  const dataLines = lines.slice(1);
  
  return dataLines.map(line => {
    const fields = parseCSVLine(line);
    const obj: any = {};
    
    headers.forEach((header, index) => {
      const value = fields[index] || '';
      setNestedValue(obj, header, value);
    });
    
    return obj;
  });
};

// CSV行をパース（ダブルクォート対応）
const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  let i = 0;
  
  while (i < line.length) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // エスケープされたダブルクォート
        current += '"';
        i += 2;
      } else {
        // クォートの開始/終了
        inQuotes = !inQuotes;
        i++;
      }
    } else if (char === ',' && !inQuotes) {
      // フィールドの区切り
      result.push(current);
      current = '';
      i++;
    } else {
      current += char;
      i++;
    }
  }
  
  result.push(current);
  return result;
};

// ネストしたオブジェクトに値を設定
const setNestedValue = (obj: any, path: string, value: string): void => {
  const keys = path.split('.');
  let current = obj;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key]) {
      current[key] = {};
    }
    current = current[key];
  }
  
  const lastKey = keys[keys.length - 1];
  // 数値や真偽値の変換
  if (value === 'true') {
    current[lastKey] = true;
  } else if (value === 'false') {
    current[lastKey] = false;
  } else if (!isNaN(Number(value)) && value !== '') {
    current[lastKey] = Number(value);
  } else {
    current[lastKey] = value;
  }
};

// ファイルダウンロード
export const downloadCSV = (csvContent: string, filename: string): void => {
  const BOM = '\uFEFF'; // UTF-8 BOM for Excel compatibility
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

// ファイル読み込み
export const readCSVFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        // BOMを除去
        const content = result.replace(/^\uFEFF/, '');
        resolve(content);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file, 'UTF-8');
  });
};