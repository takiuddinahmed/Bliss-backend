import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * prepare filter query
 * @Param query
 * @returns {Object}
 */
export function createSearchQuery(query) {
  try {
    return query.hasOwnProperty('filter') && query.filter
      ? {
          ...query,
          ...JSON.parse(query.filter),
        }
      : query;
  } catch (err) {
    throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
  }
}
