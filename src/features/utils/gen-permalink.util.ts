import { Model } from 'mongoose';

export async function generatePermalink(
  title: string,
  model: Model<any>,
  key = 'permalink',
) {
  let permalink = title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
  const found = await model.findOne({ [key]: permalink });
  if (found) {
    permalink = `${permalink}-${Math.random().toString(36).substr(2, 4)}`;
  }
  return permalink;
}
