const sortByIdAsc = (prev: { id: number }, next: { id: number }) =>
  prev.id - next.id;

export { sortByIdAsc };
