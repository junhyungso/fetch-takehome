import { Dispatch, SetStateAction } from 'react';

const toggleSortOrder = (
  currentSort: string,
  setSort: Dispatch<SetStateAction<string>>,
  field: 'breed' | 'name'
) => {
  setSort(currentSort === `${field}:asc` ? `${field}:desc` : `${field}:asc`);
};

export default toggleSortOrder;
