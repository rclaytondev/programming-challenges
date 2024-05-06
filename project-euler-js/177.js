const solve = () => {
	/* returns the number of integer-angled quadrilaterals. */
	let result = 0;
	for(let angle1 = 1; angle1 <= 179; angle1 ++) {
		const vertex1 = new Vector(0, 0);
		for(let angle2 = 1; angle2 <= 180 - angle1; angle2 ++) {
			for(let angle3 = 1; angle3 <= 180 - angle2; angle3 ++) {
				const vertex2 = new Vector(1, 0).rotate(angle2);
				for(let angle4 = 0; angle4 <= 180 - angle3; angle4 ++) {
					
				}
			}
		}
	}
};
