import { collectionNames } from './collectionNames.config';

export const userPopulateSelect = 'firstName lastName email proPic';
export const userVirtualOptions = {
  ref: collectionNames.user,
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
  options: {
    select: userPopulateSelect,
  },
  autopopulate: true,
};
