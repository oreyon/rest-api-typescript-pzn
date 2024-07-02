export type Paging = {
	currentPage: number;
	totalPage: number;
	size: number;
};

export type Pageable<T> = {
	data: Array<T>;
	paging: Paging;
};
