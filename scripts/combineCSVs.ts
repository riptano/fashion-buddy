import { parse } from '@fast-csv/parse';
import AdmZip from 'adm-zip';
import { OriginalProduct } from '@/utils/types';

const categoryMap: { [key: string]: string } = {
  "SHIRTS": "TOPS",
  "JACKETS": "OUTERWEAR",
  "WORKWEARNEW": "TOPS",
  "TROUSERS": "BOTTOMS",
  "SHORTS": "BOTTOMS",
  "BAGS": "ACCESSORIES",
  "POLO SHIRTS": "TOPS",
  "SWIMWEAR": "ACTIVEWEAR",
  "SWEATERS_CARDIGANS": "TOPS",
  "HOODIES_SWEATSHIRTS": "TOPS",
  "OVERSHIRTS": "TOPS",
  "ZARA ATHLETICZ": "ACTIVEWEAR",
  "SPECIAL PRICES": "ACCESSORIES",
  "BEAUTY": "ACCESSORIES"
};

const getNewCategory = (category: string): string => {
  return categoryMap[category] || category;
}

const convertToDollars = (rupeesString: string): number => {
  const rupees = parseFloat(rupeesString.replace('₹', '').replace(/,/g, ''));
  const rate = 0.011;
  const dollars = rupees * rate;
  return parseFloat(dollars.toFixed(2));
}

const extractImgUrls = (imagesStr: string): string => {
  const urlRegex = /https?:\/\/[^']+/;
  const matches = imagesStr.match(urlRegex);
  return matches?.[0] || '';
}

export const unzipAndReadCSVs = async (zipFilePath: string): Promise<OriginalProduct[]> => {
  const zip = new AdmZip(zipFilePath);
  const zipEntries = zip.getEntries(); // an array of ZipEntry records

  const csvData: OriginalProduct[] = [];

  const promises = [];

  zipEntries.forEach(entry => {
    if (entry.entryName.endsWith('.csv')) {
      const promise = new Promise((resolve, reject) => {
        const content = zip.readAsText(entry.entryName);

        const cleanName = entry.entryName.split('.')[0]
        const [ gender, _, category] = cleanName.split('/');

        const stream = parse({
            headers: headers => headers.map(h => h === '' ? 'item_number' : h.toLowerCase().trim()),
          })
          .on('error', error => {
            console.error(error);
            reject(error);
          })
          .on('data', row => {
            // only add products that have images
            if (row.product_images) {
              csvData.push({
                ...row,
                gender,
                category: getNewCategory(category),
                price: convertToDollars(row.price),
                product_images: extractImgUrls(row.product_images),
              });
            }
          })
          .on('end', (rowCount: number) => {
            console.log(`Parsed ${rowCount} rows in ${entry.entryName}`);
            resolve(`parsed ${entry.entryName} successfully!`);
          });

        stream.write(content);
        stream.end();
      });

      promises.push(promise);
    }
  });

  try {
    await Promise.all(promises);

    if (csvData.length > 0) {
      return csvData;
    } else {
      console.log("No data available.");
      return [];
    }
  } catch (error) {
    console.error("Error processing entries:", error);
    throw error;
  }
};
