export default {
	mined: {
		dirt: {
			col: 1,
			row: 0,
			value: 0,
		},
	},
	walkables: {
		sky: {
			col: 0,
			row: 0,
			value: 0,
		},
		mined_dirt: {
			col: 1,
			row: 0,
			value: 0,
		},
	},
	surface: {
		center: {
			col: 0,
			row: 1,
		},
		left: {
			col: 1,
			row: 1,
		},
		right: {
			col: 2,
			row: 1,
		},
	},
	edges: {
		center: {
			col: 0,
			row: 2,
		},
		left: {
			col: 1,
			row: 2,
		},
		right: {
			col: 2,
			row: 2,
		},
		up: {
			col: 3,
			row: 2,
		},
		down: {
			col: 4,
			row: 2,
		},
	},
	corners: {
		top_left: {
			col: 0,
			row: 3,
		},
		top_right: {
			col: 1,
			row: 3,
		},
		bottom_right: {
			col: 2,
			row: 3,
		},
		bottom_left: {
			col: 3,
			row: 3,
		},
	},
};
